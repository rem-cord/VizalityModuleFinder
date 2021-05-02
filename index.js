/* ModuleFinder, a Vizality plugin to ease plugin development
 * Copyright (C) 2021 Vendicated
 *
 * ModuleFinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ModuleFinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ModuleFinder.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";

import { Plugin } from "@vizality/entities";
import { getAllModules } from "@vizality/webpack";

import Settings from "./components/Settings";

function find(key, search, caps = 0) {
  return !key.startsWith("_") && key.toLowerCase().includes(search) && key.charAt(0)[caps ? "toUpperCase" : "toLowerCase"]() === key.charAt(0);
}

const defaults = {
	nmf_text: "Sorry, I couldn't find anything with that keyword.",
};

export default class ModuleFinder extends Plugin {
  start() {
		this.registerSettings((props) => (
			<Settings
				defaults={defaults}
				{...props}
			/>
		));
    
    vizality.api.commands.registerCommand({ 
      command: "findmodules", 
      description: "Finds all modules relating to a specified keyword.", 
      executor: this.handleCommand.bind(this, this.findModules.bind(this, 0)) 
    });
    
    vizality.api.commands.registerCommand({ 
      command: "findconstants", 
      description: "Finds all constants relating to a specified keyword.", 
      executor: this.handleCommand.bind(this, this.findModules.bind(this, 1)) 
    });

    vizality.api.commands.registerCommand({ 
      command: "findcomponents", 
      description: "Finds all components relating to a specified keyword.", 
      executor: this.handleCommand.bind(this, this.findComponents) });
  }

  handleCommand(fn, args) {
    if (!args.length) return { result: "ok" };

    const results = fn(args[0].toLowerCase());

    if (!results.length)
      if (this.settings.get("nmf_toast", true) === true) {
        return vizality.api.notifications.sendToast({
          header: this.settings.get("nmf_text", defaults.nmf_text),
          id: `nmf-toast`,
          timeout: 1000,
        });
      } else {
        return {
          result: this.settings.get("nmf_text", defaults.nmf_text)
        };
      }


    return {
      result: "```\n" + results.join("\n") + "```"
    };
  }

  findComponents(search) {
    return getAllModules(m => !m.displayName?.startsWith("_") && m.displayName?.toLowerCase().includes(search), false).map(f => f.displayName);
  }

  findModules(upper, search) {
    return getAllModules(m => Object.keys(m).some(k => find(k, search, upper)) || (m.__proto__ && Object.keys(m.__proto__).some(k => find(k, search, upper))))
      .flatMap(v =>
        Object.keys(v)
          .filter(k => find(k, search, upper))
          .concat(v.__proto__ ? Object.keys(v.__proto__).filter(k => find(k, search, upper)) : [])
      )
      .filter(Boolean);
  }

  stop() {
    vizality.api.commands.unregisterCommand("findmodules");
    vizality.api.commands.unregisterCommand("findconstants");
    vizality.api.commands.unregisterCommand("findcomponents");
  }
};

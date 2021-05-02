import React, { Component } from "react";
import { TextInput, SwitchItem } from "@vizality/components/settings";
import { Divider } from "@vizality/components"
import { getModule } from '@vizality/webpack';

export default class Settings extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			getSetting,
			updateSetting,
			toggleSetting,
			defaults,
		} = this.props;

		return (
    <>
      <TextInput
						note={
							<div
								class={getModule("markup").markup}
								style={{ color: "var(--header-secondary)" }}
							>
								Influences text that will be shown when nothing was found from a keyword. (Default
								value: <code class="inline">{defaults.nmf_text}</code>)
							</div>
						}
						defaultValue={getSetting("nmf_text", defaults.nmf_text)}
						required={true}
						onChange={(value) => {
							updateSetting("nmf_text", value);
						}}
					>
						Not Found Text
      </TextInput>

      <SwitchItem
      note={
        <div
          class={getModule("markup").markup}
          style={{ color: "var(--header-secondary)" }}
        >
          Influences whether a toast will be shown when no modules are found in place of a chat message. (Default value: <code class="inline">{"false"}</code>)
        </div>
      }
      value={getSetting("nmf_toast", false)}
						onChange={() => {
							toggleSetting("nmf_toast");
						}}
					>
						Toast
      </SwitchItem>
    </>
		);
	}
}
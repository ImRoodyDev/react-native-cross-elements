import {Platform} from "react-native";

let isFixStyleInjected = false;

function injectAutofillStyle() {
	// If the style has already been injected, do nothing
	if (isFixStyleInjected && Platform.OS == 'web') return;

	// Mark the style as injected
	isFixStyleInjected = true;

	// Create the style element only if it doesn't exist
	let styleElement = document.getElementById('autofill-protection-style');

	if (!styleElement) {
		styleElement = document.createElement('style');
		styleElement.id = 'autofill-protection-style';
		document.head.appendChild(styleElement);

		// Inject the CSS rule for autofill state
		styleElement.innerHTML = `
		#rn-label-input input:autofill + #rn-label-placeholder,
        #rn-label-input input:-webkit-autofill + #rn-label-placeholder {
            transform: translateY(-100%)!important;
      }`;
	}
}

injectAutofillStyle();


export * from './interactables';
export * from './navigation';
export type * from './interactables';
export type * from './navigation';
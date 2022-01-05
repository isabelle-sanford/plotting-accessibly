# plotting-accessibly
a library for creating accessibility-friendly graphs and visualizations

## Goals

I want this library to be something akin to Plotly, C3, or Matplotlib, but designed from the start to be as accessible as possible to end-users on the internet. This will be a long-running project, and stage 1 is to create just a simple bar chart with the features listed below. 

Specific features in mind to date:
* Captioning/alt-text on graphs
* Ensure font resizeability & try to make small details otherwise easier on the nearsighted (e.g. bigger dots on scatterplots?)
* Sensible screen-reader output
* Appropriate color palettes for the colorblind, and encouragement to use more than just color as a distinguishing factor

## Accessibility needs to address

* Keyboard-only input
* Colorblindness (provide appropriate color palettes and non-coloration differentiation; encourage using both at once)
* Nearsightedness
* Using a screen reader

## Resources / Research

* Web accessibility standards: https://www.w3.org/WAI/standards-guidelines/wcag/
* Web accessibility implementations (ARIA): https://www.w3.org/TR/wai-aria-practices-1.1/
* Standards for keyboard input support: https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard
* Aria live (esp for react?): https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
* Web accessibility for designers info sheet: https://webaim.org/resources/designers/
* WebAIM: https://webaim.org/
* Web Accessibility Initiative: https://www.w3.org/WAI/
* W3C Tutorials: https://www.w3.org/WAI/tutorials/

Other Notes
- Recent content (2020-2021) on 538 is a good example of accessible visualizations; previous content (esp. 3-4 years previous) is a good example of deeply inaccessible visualizations

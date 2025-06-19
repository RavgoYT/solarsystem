export function setupUIElements() {
    // No elements to create, as speed slider is in index.html
    // I forgot and made this, but maybe it'll be useful in the future?

    // Tooltip element
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.background = 'rgba(30,30,40,0.95)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '10px 18px';
        tooltip.style.borderRadius = '10px';
        tooltip.style.fontSize = '1.1em';
        tooltip.style.fontWeight = 'bold';
        tooltip.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
        tooltip.style.transition = 'opacity 0.2s';
        tooltip.style.opacity = '0';
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);
    }

    // Expose tooltip for use in main script
    window._solarSystemTooltip = tooltip;
}
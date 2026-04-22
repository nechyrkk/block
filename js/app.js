(function () {
    'use strict';

    var root = document.querySelector('[data-progress]');
    var valueInput = document.getElementById('value-input');
    var animateToggle = document.getElementById('animate-toggle');
    var hideToggle = document.getElementById('hide-toggle');

    if (!root || !valueInput || !animateToggle || !hideToggle) {
        return;
    }

    var initialValue = parseValue(valueInput.value);

    var progress = new Progress(root, {
        value: initialValue,
        animated: animateToggle.checked,
        hidden: hideToggle.checked
    });

    valueInput.value = String(initialValue);

    valueInput.addEventListener('input', function () {
        var sanitized = valueInput.value.replace(/[^\d]/g, '');
        if (sanitized !== valueInput.value) {
            valueInput.value = sanitized;
        }
        if (sanitized === '') {
            progress.setValue(0);
            return;
        }
        var parsed = parseValue(sanitized);
        progress.setValue(parsed);
    });

    valueInput.addEventListener('blur', function () {
        var normalized = parseValue(valueInput.value);
        valueInput.value = String(normalized);
        progress.setValue(normalized);
    });

    animateToggle.addEventListener('change', function () {
        progress.setAnimated(animateToggle.checked);
    });

    hideToggle.addEventListener('change', function () {
        progress.setHidden(hideToggle.checked);
    });

    function parseValue(raw) {
        var num = parseInt(raw, 10);
        if (isNaN(num)) {
            return 0;
        }
        if (num < 0) {
            return 0;
        }
        if (num > 100) {
            return 100;
        }
        return num;
    }
})();

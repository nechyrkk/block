(function (global) {
    'use strict';

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var RADIUS = 42;

    function clampValue(value) {
        var num = Number(value);
        if (!isFinite(num)) {
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

    function createSvg() {
        var svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'progress__svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('aria-hidden', 'true');

        var track = document.createElementNS(SVG_NS, 'circle');
        track.setAttribute('class', 'progress__track');
        track.setAttribute('cx', '50');
        track.setAttribute('cy', '50');
        track.setAttribute('r', String(RADIUS));

        var arc = document.createElementNS(SVG_NS, 'circle');
        arc.setAttribute('class', 'progress__arc');
        arc.setAttribute('cx', '50');
        arc.setAttribute('cy', '50');
        arc.setAttribute('r', String(RADIUS));
        arc.setAttribute('pathLength', '100');

        svg.appendChild(track);
        svg.appendChild(arc);
        return svg;
    }

    function Progress(root, options) {
        if (!(root instanceof Element)) {
            throw new TypeError('Progress: root must be a DOM element');
        }

        var opts = options || {};

        this._root = root;
        this._value = clampValue(opts.value != null ? opts.value : 0);
        this._animated = Boolean(opts.animated);
        this._hidden = Boolean(opts.hidden);

        this._render();
        this._apply();
    }

    Progress.prototype._render = function () {
        if (!this._root.classList.contains('progress')) {
            this._root.classList.add('progress');
        }

        var existing = this._root.querySelector('.progress__svg');
        if (existing) {
            this._root.removeChild(existing);
        }

        this._root.appendChild(createSvg());
    };

    Progress.prototype._apply = function () {
        this._root.style.setProperty('--progress-value', String(this._value));
        this._root.classList.toggle('is-animated', this._animated);
        this._root.classList.toggle('is-hidden', this._hidden);
        this._root.setAttribute('data-value', String(this._value));
    };

    Progress.prototype.setValue = function (value) {
        var next = clampValue(value);
        if (next === this._value) {
            return this;
        }
        this._value = next;
        this._apply();
        return this;
    };

    Progress.prototype.getValue = function () {
        return this._value;
    };

    Progress.prototype.setAnimated = function (flag) {
        var next = Boolean(flag);
        if (next === this._animated) {
            return this;
        }
        this._animated = next;
        this._apply();
        return this;
    };

    Progress.prototype.isAnimated = function () {
        return this._animated;
    };

    Progress.prototype.setHidden = function (flag) {
        var next = Boolean(flag);
        if (next === this._hidden) {
            return this;
        }
        this._hidden = next;
        this._apply();
        return this;
    };

    Progress.prototype.isHidden = function () {
        return this._hidden;
    };

    Progress.prototype.destroy = function () {
        this._root.classList.remove('is-animated', 'is-hidden');
        this._root.style.removeProperty('--progress-value');
        this._root.removeAttribute('data-value');
        var svg = this._root.querySelector('.progress__svg');
        if (svg) {
            this._root.removeChild(svg);
        }
    };

    global.Progress = Progress;
})(window);

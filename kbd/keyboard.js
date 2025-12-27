(function() {
    window.Keyboard = function(config) {
        config = config || {};

        const util = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent),

            preventDefault: function(event) {
                if (!event) event = window.event;
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            },

            getCode: function(event) {
                if (!event) event = window.event;
                if (event.code !== undefined && event.key !== undefined) {
                    return event.code;
                }
                return "Unidentified";
            },

            srcId: function(event, container, tagName) {
                if (!event) event = window.event;
                let target = event.target || event.srcElement;
                if (target.nodeType === 3) target = target.parentNode;
                
                while (target.tagName.toLowerCase() !== tagName) {
                    target = target.parentNode;
                    if (target === container || target.tagName.toLowerCase() === "body") {
                        return null;
                    }
                }
                return target.id;
            },

            insertAtCaret: function(element, text) {
                const start = this.getSelectionStart(element);
                const end = this.getSelectionEnd(element);
                const value = element.value;
                element.value = value.substring(0, start) + text + value.substring(end);
                this.setCaretPosition(element, start + text.length, 0);
            },

            deleteAtCaret: function(element, before, after) {
                const start = this.getSelectionStart(element);
                const end = this.getSelectionEnd(element);
                const length = element.value.length;
                
                if (before > start) before = start;
                if (end + after > length) after = length - end;
                
                const deleted = element.value.substring(start - before, end + after);
                element.value = element.value.substring(0, start - before) + element.value.substring(end + after);
                this.setCaretPosition(element, start - before, 0);
                return deleted;
            },

            getSelectionStart: function(element) {
                element.focus();
                if (element.selectionStart !== undefined) {
                    return element.selectionStart;
                }
                return 0;
            },

            getSelectionEnd: function(element) {
                element.focus();
                if (element.selectionEnd !== undefined) {
                    return element.selectionEnd;
                }
                return element.value.length;
            },

            setCaretPosition: function(element, start, length) {
                element.focus();
                if (element.setSelectionRange) {
                    element.setSelectionRange(start, start + length);
                } else if (element.createTextRange) {
                    const range = element.createTextRange();
                    range.collapse(true);
                    range.moveEnd("character", start + length);
                    range.moveStart("character", start);
                    range.select();
                }
            },

            addListener: function(element, event, handler) {
                if (element.addEventListener) {
                    element.addEventListener(event, handler, false);
                } else if (element.attachEvent) {
                    element.attachEvent("on" + event, handler);
                } else {
                    element["on" + event] = handler;
                }
            }
        };

        const keyboard = {
            keyMap: [
                ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
                ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
                ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
                ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
                ["ControlLeft", "AltLeft", "Space", "Escape", "AltRight", "ControlRight"]
            ],

            buttonIdMap: {
                "kb-k0": "Backquote", "kb-k1": "Digit1", "kb-k2": "Digit2", "kb-k3": "Digit3",
                "kb-k4": "Digit4", "kb-k5": "Digit5", "kb-k6": "Digit6", "kb-k7": "Digit7",
                "kb-k8": "Digit8", "kb-k9": "Digit9", "kb-k10": "Digit0", "kb-k11": "Minus",
                "kb-k12": "Equal", "kb-backspace": "Backspace", "kb-tab": "Tab",
                "kb-k13": "KeyQ", "kb-k14": "KeyW", "kb-k15": "KeyE", "kb-k16": "KeyR",
                "kb-k17": "KeyT", "kb-k18": "KeyY", "kb-k19": "KeyU", "kb-k20": "KeyI",
                "kb-k21": "KeyO", "kb-k22": "KeyP", "kb-k23": "BracketLeft", "kb-k24": "BracketRight",
                "kb-k25": "Backslash", "kb-caps-lock": "CapsLock", "kb-k26": "KeyA", "kb-k27": "KeyS",
                "kb-k28": "KeyD", "kb-k29": "KeyF", "kb-k30": "KeyG", "kb-k31": "KeyH",
                "kb-k32": "KeyJ", "kb-k33": "KeyK", "kb-k34": "KeyL", "kb-k35": "Semicolon",
                "kb-k36": "Quote", "kb-enter": "Enter", "kb-left-shift": "ShiftLeft",
                "kb-k37": "KeyZ", "kb-k38": "KeyX", "kb-k39": "KeyC", "kb-k40": "KeyV",
                "kb-k41": "KeyB", "kb-k42": "KeyN", "kb-k43": "KeyM", "kb-k44": "Comma",
                "kb-k45": "Period", "kb-k46": "Slash", "kb-right-shift": "ShiftRight",
                "kb-left-ctrl": "ControlLeft", "kb-left-alt": "AltLeft",
                "kb-space": "Space", "kb-escape": "Escape", "kb-right-alt": "AltRight",
                "kb-right-ctrl": "ControlRight"
            },

            codeButtonIdMap: {
                "Backquote": "kb-k0", "Digit1": "kb-k1", "Digit2": "kb-k2", "Digit3": "kb-k3",
                "Digit4": "kb-k4", "Digit5": "kb-k5", "Digit6": "kb-k6", "Digit7": "kb-k7",
                "Digit8": "kb-k8", "Digit9": "kb-k9", "Digit0": "kb-k10", "Minus": "kb-k11",
                "Equal": "kb-k12", "Backspace": "kb-backspace", "Tab": "kb-tab",
                "KeyQ": "kb-k13", "KeyW": "kb-k14", "KeyE": "kb-k15", "KeyR": "kb-k16",
                "KeyT": "kb-k17", "KeyY": "kb-k18", "KeyU": "kb-k19", "KeyI": "kb-k20",
                "KeyO": "kb-k21", "KeyP": "kb-k22", "BracketLeft": "kb-k23", "BracketRight": "kb-k24",
                "Backslash": "kb-k25", "CapsLock": "kb-caps-lock", "KeyA": "kb-k26", "KeyS": "kb-k27",
                "KeyD": "kb-k28", "KeyF": "kb-k29", "KeyG": "kb-k30", "KeyH": "kb-k31",
                "KeyJ": "kb-k32", "KeyK": "kb-k33", "KeyL": "kb-k34", "Semicolon": "kb-k35",
                "Quote": "kb-k36", "Enter": "kb-enter", "ShiftLeft": "kb-left-shift",
                "KeyZ": "kb-k37", "KeyX": "kb-k38", "KeyC": "kb-k39", "KeyV": "kb-k40",
                "KeyB": "kb-k41", "KeyN": "kb-k42", "KeyM": "kb-k43", "Comma": "kb-k44",
                "Period": "kb-k45", "Slash": "kb-k46", "ShiftRight": "kb-right-shift",
                "ControlLeft": "kb-left-ctrl", "AltLeft": "kb-left-alt",
                "Space": "kb-space", "Escape": "kb-escape", "AltRight": "kb-right-alt",
                "ControlRight": "kb-right-ctrl"
            },

            charMap: config.charMap || { natural: {}, shift: {} },

            referenceMap: {
                Backquote: "`", Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5",
                Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0", Minus: "-", Equal: "=",
                KeyQ: "q", KeyW: "w", KeyE: "e", KeyR: "r", KeyT: "t", KeyY: "y", KeyU: "u",
                KeyI: "i", KeyO: "o", KeyP: "p", BracketLeft: "[", BracketRight: "]", Backslash: "\\",
                KeyA: "a", KeyS: "s", KeyD: "d", KeyF: "f", KeyG: "g", KeyH: "h", KeyJ: "j",
                KeyK: "k", KeyL: "l", Semicolon: ";", Quote: "'",
                KeyZ: "z", KeyX: "x", KeyC: "c", KeyV: "v", KeyB: "b", KeyN: "n", KeyM: "m",
                Comma: ",", Period: ".", Slash: "/"
            },

            shift: false,
            capsLock: false,
            recessed: false,

            keydown: function(event) {
                if (event.ctrlKey || event.altKey || event.metaKey) {
                    return;
                }

                const code = util.getCode(event);
                if (code === "Unidentified") return;

                if (code === "Escape") {
                    this.recessed = !this.recessed;
                    this.updateRecessed();
                    util.preventDefault(event);
                    return;
                }

                if (this.recessed) {
                    return;
                }

                if (code === "ShiftLeft" || code === "ShiftRight") {
                    this.shift = true;
                    this.updateLabels();
                    return;
                }

                if (code === "CapsLock") {
                    this.capsLock = !this.capsLock;
                    this.updateLabels();
                    return;
                }

                if (code === "Tab") {
                    return;
                }

                if (code === "Backspace" || code === "Enter") {
                    return;
                }

                let char = this.charMap.natural[code];
                if (this.shift || this.capsLock) {
                    char = this.charMap.shift[code];
                }

                if (char !== undefined) {
                    util.preventDefault(event);
                    util.insertAtCaret(editor.element, char);
                }
            },

            keyup: function(event) {
                if (this.recessed) return;

                const code = util.getCode(event);
                if (code === "Unidentified") return;

                if (code === "ShiftLeft" || code === "ShiftRight") {
                    this.shift = false;
                    this.updateLabels();
                }
            },

            buttonMouseDown: function(event) {
                const buttonId = util.srcId(event, document.getElementById("kb-keyboard"), "button");
                if (buttonId === null) return;

                const code = this.buttonIdMap[buttonId];
                if (code === undefined) return;

                if (code === "ShiftLeft" || code === "ShiftRight") {
                    this.shift = true;
                    this.updateLabels();
                    return;
                }

                if (code === "CapsLock") {
                    this.capsLock = !this.capsLock;
                    this.updateLabels();
                    return;
                }

                if (code === "ControlLeft" || code === "ControlRight" || 
                    code === "AltLeft" || code === "AltRight") {
                    return;
                }

                if (code === "Escape") {
                    this.recessed = !this.recessed;
                    this.updateRecessed();
                    return;
                }

                if (code === "Tab") {
                    util.insertAtCaret(editor.element, "\t");
                    return;
                }

                if (code === "Backspace") {
                    util.deleteAtCaret(editor.element, 1, 0);
                    return;
                }

                if (code === "Enter") {
                    util.insertAtCaret(editor.element, "\n");
                    return;
                }

                let char = this.charMap.natural[code];
                if (this.shift || this.capsLock) {
                    char = this.charMap.shift[code];
                }

                if (this.recessed) {
                    char = this.referenceMap[code];
                    if (this.shift || this.capsLock) {
                        char = char.toUpperCase();
                    }
                }

                if (char !== undefined) {
                    util.insertAtCaret(editor.element, char);
                }
            },

            buttonMouseUp: function(event) {
                const buttonId = util.srcId(event, document.getElementById("kb-keyboard"), "button");
                if (buttonId === null) return;

                if (buttonId === "kb-left-shift" || buttonId === "kb-right-shift") {
                    this.shift = false;
                    this.updateLabels();
                }
            },

            updateLabels: function() {
                for (const row of this.keyMap) {
                    for (const code of row) {
                        const buttonId = this.codeButtonIdMap[code];
                        const button = document.getElementById(buttonId);
                        if (button) {
                            const spans = button.getElementsByTagName("span");
                            if (spans.length >= 2) {
                                if (this.shift || this.capsLock) {
                                    spans[0].style.display = "none";
                                    spans[1].style.display = "block";
                                } else {
                                    spans[0].style.display = "block";
                                    spans[1].style.display = "none";
                                }
                            }
                        }
                    }
                }
            },

            updateRecessed: function() {
                const keyboardEl = document.getElementById("kb-keyboard");
                keyboardEl.className = this.recessed ? "kb-recessed" : "";
            },

            build: function() {
                let html = "";

                for (const row of this.keyMap) {
                    for (const code of row) {
                        const buttonId = this.codeButtonIdMap[code];
                        const natural = this.charMap.natural[code] || "";
                        const shift = this.charMap.shift[code] || "";

                        if (code === "Backspace") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">&larr;</button>`;
                        } else if (code === "Tab") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Tab</button>`;
                        } else if (code === "CapsLock") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Caps</button>`;
                        } else if (code === "Enter") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Enter</button>`;
                        } else if (code === "ShiftLeft" || code === "ShiftRight") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Shift</button>`;
                        } else if (code === "ControlLeft" || code === "ControlRight") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Ctrl</button>`;
                        } else if (code === "AltLeft" || code === "AltRight") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Alt</button>`;
                        } else if (code === "Space") {
                            html += `<button type="button" id="${buttonId}" class="kb-key"></button>`;
                        } else if (code === "Escape") {
                            html += `<button type="button" id="${buttonId}" class="kb-key">Esc</button>`;
                        } else {
                            html += `<button type="button" id="${buttonId}" class="kb-key">` +
                                    `<span class="kb-label-natural">${natural}</span>` +
                                    `<span class="kb-label-shift" style="display:none">${shift}</span>` +
                                    `</button>`;
                        }
                    }
                    html += '<div class="kb-clear"></div>';
                }

                document.getElementById("keyboard").innerHTML = `<div id="kb-keyboard">${html}</div>`;

                const keyboardEl = document.getElementById("kb-keyboard");
                util.addListener(keyboardEl, "mousedown", this.buttonMouseDown.bind(this));
                util.addListener(keyboardEl, "mouseup", this.buttonMouseUp.bind(this));
            }
        };

        const editor = {
            element: null,
            history: [],
            historyIndex: -1,

            init: function() {
                this.element = document.getElementById("editor");
                keyboard.build();

                util.addListener(this.element, "keydown", keyboard.keydown.bind(keyboard));
                util.addListener(this.element, "keyup", keyboard.keyup.bind(keyboard));

                util.addListener(document.getElementById("selectAll"), "click", () => {
                    this.element.select();
                });

                util.addListener(document.getElementById("copy"), "click", () => {
                    this.element.select();
                    document.execCommand("copy");
                });

                util.addListener(document.getElementById("clearAll"), "click", () => {
                    this.element.value = "";
                });

                util.addListener(document.getElementById("shrink"), "click", () => {
                    const size = parseInt(window.getComputedStyle(this.element).fontSize);
                    this.element.style.fontSize = (size - 2) + "px";
                });

                util.addListener(document.getElementById("enlarge"), "click", () => {
                    const size = parseInt(window.getComputedStyle(this.element).fontSize);
                    this.element.style.fontSize = (size + 2) + "px";
                });

                util.addListener(this.element, "input", () => {
                    this.history = this.history.slice(0, this.historyIndex + 1);
                    this.history.push(this.element.value);
                    this.historyIndex = this.history.length - 1;
                });

                util.addListener(document.getElementById("undo"), "click", () => {
                    if (this.historyIndex > 0) {
                        this.historyIndex--;
                        this.element.value = this.history[this.historyIndex];
                    }
                });

                util.addListener(document.getElementById("redo"), "click", () => {
                    if (this.historyIndex < this.history.length - 1) {
                        this.historyIndex++;
                        this.element.value = this.history[this.historyIndex];
                    }
                });

                this.history.push(this.element.value);
                this.historyIndex = 0;
            }
        };

        util.addListener(window, "load", () => editor.init());
    };
})();

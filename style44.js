/**
 * =================================================================
 * SCRIPT.JS - HTML LIVE EDITOR (v36 - Button Action Editing)
 * =================================================================
 * This version adds the ability to edit button actions (URLs) directly in the inspector.
 * - When a button is selected, the Content section now includes a Link URL field
 * - Users can set external URLs or internal page links for buttons
 * - Buttons are automatically wrapped in anchor tags when a URL is applied
 * - Removing the URL unwraps the button from the anchor tag
 * - Maintains all existing functionality for regular links and buttons
 */
document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. DOM ELEMENT REFERENCES
    // =================================================================
    const previewFrame = document.getElementById('previewFrame');
    const htmlInputBottom = document.getElementById('htmlInputBottom');
    const htmlCodeEditorSection = document.getElementById('htmlCodeEditorSection');
    const statusDiv = document.getElementById('status');
    const editingStatus = document.getElementById('editingStatus');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const elementInspector = document.getElementById('elementInspector');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // Inspector Elements
    const inspectorControls = document.getElementById('inspectorControls');
    const inspectorDefaultMessage = document.getElementById('inspectorDefaultMessage');
    const elementTagName = document.getElementById('elementTagName');
    
    // Inspector Control Groups & Inputs
    const textControlGroup = document.getElementById('textControlGroup');
    const textContentInput = document.getElementById('textContentInput');
    const imageControlGroup = document.getElementById('imageControlGroup');
    const imageUrlInput = document.getElementById('imageUrlInput');
    const imageAltInput = document.getElementById('imageAltInput');
    const iconControlGroup = document.getElementById('iconControlGroup');
    const linkControlGroup = document.getElementById('linkControlGroup');
    const linkUrlInput = document.getElementById('linkUrlInput');
    const linkTargetToggle = document.getElementById('linkTargetToggle');
    const responsiveControlGroup = document.getElementById('responsiveControlGroup');
    const hoverControlGroup = document.getElementById('hoverControlGroup');
    const applyToAllGroup = document.getElementById('applyToAllGroup');
    const bgColorInput = document.getElementById('bgColorInput');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor2 = document.getElementById('gradientColor2');
    const gradientColor3 = document.getElementById('gradientColor3');
    const gradientDirection = document.getElementById('gradientDirection');
    const hoverColorInput = document.getElementById('hoverColorInput');
    const hoverTextColorInput = document.getElementById('hoverTextColorInput');
    const responsiveToggle = document.getElementById('responsiveToggle');
    const applyToAllToggle = document.getElementById('applyToAllToggle');
    const applyToAllLabel = document.getElementById('applyToAllLabel');
    const borderWidth = document.getElementById('borderWidth');
    const borderStyle = document.getElementById('borderStyle');
    const borderColor = document.getElementById('borderColor');
    const borderRadius = document.getElementById('borderRadius');
    const boxShadowToggle = document.getElementById('boxShadowToggle');
    const glowEffectToggle = document.getElementById('glowEffectToggle');
    const fieldHoverControlGroup = document.getElementById('fieldHoverControlGroup');
    const hoverBorderColorInput = document.getElementById('hoverBorderColorInput');
    const hoverBgColorInput = document.getElementById('hoverBgColorInput');
    const sizeControlGroup = document.getElementById('sizeControlGroup');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const lineHeight = document.getElementById('lineHeight');
    const letterSpacing = document.getElementById('letterSpacing');
    const textTransform = document.getElementById('textTransform');
    const displayProperty = document.getElementById('displayProperty');
    const opacityInput = document.getElementById('opacityInput');
    const iconSizeInput = document.getElementById('iconSizeInput');
    const iconColorInput = document.getElementById('iconColorInput');
    const moveUpBtn = document.getElementById('moveUpBtn');
    const moveDownBtn = document.getElementById('moveDownBtn');
    const moveLeftBtn = document.getElementById('moveLeftBtn');
    const moveRightBtn = document.getElementById('moveRightBtn');
    
    // Spacing Inputs
    const paddingInputs = {
        top: document.getElementById('paddingTop'), right: document.getElementById('paddingRight'),
        bottom: document.getElementById('paddingBottom'), left: document.getElementById('paddingLeft'),
    };
    const marginInputs = {
        top: document.getElementById('marginTop'), right: document.getElementById('marginRight'),
        bottom: document.getElementById('marginBottom'), left: document.getElementById('marginLeft'),
    };
    
    // Contextual Text Toolbar
    const textToolbar = document.getElementById('textToolbar');
    const tagSelector = document.getElementById('tagSelector');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const textAlignLeft = document.getElementById('textAlignLeft');
    const textAlignCenter = document.getElementById('textAlignCenter');
    const textAlignRight = document.getElementById('textAlignRight');
    const textAlignJustify = document.getElementById('textAlignJustify');

    // Heroicons Modal
    const heroiconsModal = document.getElementById('heroiconsModal');
    const heroiconsGrid = document.getElementById('heroiconsGrid');
    const iconCategories = document.getElementById('iconCategories');
    const iconSearchInput = document.getElementById('iconSearchInput');
    const outlineTab = document.getElementById('outlineTab');
    const solidTab = document.getElementById('solidTab');
    
    // Section Modal Elements
    const sectionModal = document.getElementById('sectionModal');
    const sectionModalTitle = document.getElementById('sectionModalTitle');
    const sectionModalBody = document.getElementById('sectionModalBody');
    
    // Action Buttons
    const deleteBtn = document.querySelector('.action-btn.delete');
    const copyBtn = document.querySelector('.action-btn.copy');
    const flipBtn = document.querySelector('.action-btn.flip');

    // =================================================================
    // 2. STATE & HISTORY VARIABLES
    // =================================================================
    let isEditingEnabled = false;
    let selectedElement = null;
    let movableColumnElement = null; 
    let currentView = 'desktop';
    let editorIdCounter = 0;
    let targetClassForApplyAll = '';
    let history = [];
    let historyIndex = -1;
    const MAX_HISTORY_STEPS = 50;
    let currentIconStyle = 'outline';
    let currentIconCategory = 'All';
    const DEFAULT_USER_ID = '2581';

    // =================================================================
    // 3. INITIALIZATION & CORE FUNCTIONS
    // =================================================================
    function init() {
        populateFontSelect();
        populateTagSelector();
        const directions = { "to top": "To Top", "to right": "To Right", "to bottom": "To Bottom", "to left": "To Left", "to top right": "To Top Right", "circle at center": "Radial" };
        for (const [value, text] of Object.entries(directions)) gradientDirection.innerHTML += `<option value="${value}">${text}</option>`;
        
        populateIconCategories();
        populateHeroiconsModal();
        attachEventListeners();
        
        previewFrame.srcdoc = '<!DOCTYPE html><html><head><style>.flipped { flex-direction: row-reverse !important; }</style></head><body></body></html>';
        previewFrame.onload = () => {
            addHistoryEntry();
            previewFrame.onload = null;
        };
        elementInspector.classList.add('collapsed');
        toggleView('desktop');
        updateMovableElementAndActionButtons(null);
        lineHeight.value = 1.5; // Set default line height
    }
    
    window.enableEditing = () => {
        isEditingEnabled = true;
        editingStatus.textContent = 'Editing Enabled';
        editingStatus.classList.remove('bg-secondary');
        editingStatus.classList.add('bg-success');
        injectEditableStylesAndListeners();
    };
    
    window.disableEditing = () => {
        isEditingEnabled = false;
        editingStatus.textContent = 'Editing Disabled';
        editingStatus.classList.add('bg-secondary');
        editingStatus.classList.remove('bg-success');
        removeEditableHighlights();
        updateInspector(null);
        textToolbar.style.display = 'none';
        selectedElement = null;
        const iframeDoc = previewFrame.contentDocument;
        if (iframeDoc && iframeDoc.body) iframeDoc.body.contentEditable = 'false';
        showStatus('Editing disabled.', 'info');
    };
    
    window.updatePreviewFromBottom = () => {
        const html = htmlInputBottom.value;
        previewFrame.srcdoc = html;
        
        previewFrame.onload = () => {
            loadGoogleFonts().then(() => {
                enableEditing();
                elementInspector.classList.add('collapsed');
                addHistoryEntry();
            });
            previewFrame.onload = null;
        };
    };
    
    window.downloadHtml = () => {
        const content = getIframeContentForExport();
        const blob = new Blob([content], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showStatus('HTML file downloaded.', 'success');
    };
    
    window.syncHtml = () => {
        htmlInputBottom.value = getIframeContentForExport();
        showStatus('HTML synced to code editor.', 'info');
    };
    
    window.clearAll = () => {
        if (confirm('Are you sure you want to clear everything? This cannot be undone.')) {
            htmlInputBottom.value = '';
            previewFrame.srcdoc = '<!DOCTYPE html><html><head><style>.flipped { flex-direction: row-reverse !important; }</style></head><body></body></html>';
            previewFrame.onload = () => {
                history = [];
                historyIndex = -1;
                addHistoryEntry();
                updateUndoRedoButtons();
                 previewFrame.onload = null;
            }
        }
    };
    
    window.toggleView = (view) => {
        currentView = view;
        document.querySelectorAll('.top-toolbar-right .btn-top-toolbar').forEach(btn => btn.classList.remove('active'));
        const iframe = previewFrame;
        iframe.className = `${view}-view`;
        document.querySelector(`.btn-top-toolbar[onclick="toggleView('${view}')"]`).classList.add('active');
        responsiveControlGroup.style.display = view === 'desktop' ? 'none' : 'flex';
        if (view === 'desktop') responsiveToggle.checked = false;
        if (selectedElement) updateInspector(selectedElement);
    };
// =================================================================
    // 4. IFRAME & ELEMENT SELECTION
    // =================================================================
    function injectEditableStylesAndListeners() {
        const iframeDoc = previewFrame.contentDocument;
        if (!iframeDoc || !iframeDoc.head) return;
        if (!iframeDoc.getElementById('editor-styles')) {
            const style = iframeDoc.createElement('style');
            style.id = 'editor-styles';
            style.textContent = `.editable-highlight { outline: 2px dashed #0d6efd !important; outline-offset: 2px; cursor: pointer; } .flipped { flex-direction: row-reverse !important; }`;
            iframeDoc.head.appendChild(style);
        }
        iframeDoc.body.contentEditable = 'true';
        iframeDoc.body.querySelectorAll('*').forEach(el => el.contentEditable = 'false');
        iframeDoc.body.addEventListener('click', handleIframeClick);
    }
    
    function handleIframeClick(event) {
        if (!isEditingEnabled) return;
        let target = event.target;
        if (target.tagName === 'path' && target.closest('svg')) {
            target = target.closest('svg');
        }
        if(document.activeElement !== target) {
            event.preventDefault();
        }
        event.stopPropagation();
        
        if (elementInspector.classList.contains('collapsed')) {
            elementInspector.classList.remove('collapsed');
        }
        if (selectedElement && ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'].includes(selectedElement.tagName)) {
            selectedElement.contentEditable = 'false';
        }
        if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'].includes(target.tagName)) {
            target.contentEditable = 'true';
            target.focus();
        }
        removeEditableHighlights();
        selectedElement = target;
        selectedElement.classList.add('editable-highlight');
        updateInspector(selectedElement);
        updateTextToolbar(selectedElement);
    }
    
    function removeEditableHighlights() {
        const iframeDoc = previewFrame.contentDocument;
        if (iframeDoc) iframeDoc.querySelectorAll('.editable-highlight').forEach(el => el.classList.remove('editable-highlight'));
    }
    
    // =================================================================
    // 5. ELEMENT INSPECTOR & STYLE APPLICATION
    // =================================================================
    function updateInspector(element) {
        const showControls = !!element;
        inspectorDefaultMessage.classList.toggle('hidden', showControls);
        inspectorControls.classList.toggle('hidden', !showControls);
        
        updateMovableElementAndActionButtons(element);
        if (!element) {
            elementTagName.textContent = 'Nothing selected';
            return;
        }
        elementTagName.textContent = `<${element.tagName.toLowerCase()}>`;
        const isText = ['BUTTON', 'A', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'TD'].includes(element.tagName);
        const isImage = element.tagName === 'IMG';
        const isIcon = element.tagName === 'svg';
        const isLink = element.tagName === 'A' || element.tagName === 'BUTTON'; // Updated to include buttons
        const isHoverable = ['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(element.tagName);
        const isFormField = ['INPUT', 'TEXTAREA'].includes(element.tagName);
        
        targetClassForApplyAll = '';
        if (element.classList.contains('cta-btn1') || element.classList.contains('btn-primary-custom')) targetClassForApplyAll = 'cta-btn1';
        if (element.classList.contains('cta-btn2') || element.classList.contains('btn-secondary-custom')) targetClassForApplyAll = 'cta-btn2';
        if (element.classList.contains('form-control-generated')) targetClassForApplyAll = 'form-control-generated';
        applyToAllGroup.style.display = targetClassForApplyAll ? 'flex' : 'none';
        if (targetClassForApplyAll) {
            applyToAllLabel.textContent = (targetClassForApplyAll === 'form-control-generated') ? 'Apply to all fields' : `Apply to all .${targetClassForApplyAll}`;
            applyToAllToggle.checked = (targetClassForApplyAll === 'form-control-generated');
        }
        
        textControlGroup.style.display = isText ? 'flex' : 'none';
        imageControlGroup.style.display = isImage ? 'flex' : 'none';
        iconControlGroup.style.display = isIcon ? 'flex' : 'none';
        linkControlGroup.style.display = isLink ? 'flex' : 'none'; // Now shows for buttons too
        hoverControlGroup.style.display = isHoverable && !isFormField ? 'block' : 'none';
        fieldHoverControlGroup.style.display = isFormField ? 'block' : 'none';
        sizeControlGroup.style.display = isFormField ? 'block' : 'none';
        
        textContentInput.value = element.innerText || '';
        imageUrlInput.value = element.src || '';
        imageAltInput.value = element.alt || '';
        
        // Get the link element (either the element itself or its parent anchor)
        let linkElement = null;
        if (element.tagName === 'A') {
            linkElement = element;
        } else if (element.tagName === 'BUTTON' && element.parentElement && element.parentElement.tagName === 'A') {
            linkElement = element.parentElement;
        }
        
        linkUrlInput.value = linkElement ? linkElement.href : '';
        linkTargetToggle.checked = linkElement ? linkElement.target === '_blank' : false;
        
        const style = getElementStyle(element);
        widthInput.value = style.width;
        heightInput.value = style.height;
        displayProperty.value = style.display;
        opacityInput.value = style.opacity || 1;
        bgColorInput.value = rgbToHex(style.backgroundColor);
        
        const hoverStyle = getElementStyle(element, ':hover');
        hoverColorInput.value = rgbToHex(hoverStyle.backgroundColor);
        hoverTextColorInput.value = rgbToHex(hoverStyle.color);
        hoverBorderColorInput.value = rgbToHex(hoverStyle.borderColor);
        hoverBgColorInput.value = rgbToHex(hoverStyle.backgroundColor);
        
        borderWidth.value = parseFloat(style.borderWidth) || 0;
        borderStyle.value = style.borderStyle || 'none';
        borderColor.value = rgbToHex(style.borderColor);
        borderRadius.value = parseFloat(style.borderRadius) || 0;
        boxShadowToggle.checked = style.boxShadow && style.boxShadow !== 'none' && !style.boxShadow.includes('rgba');
        glowEffectToggle.checked = style.boxShadow && style.boxShadow.includes('rgba');
        lineHeight.value = parseFloat(style.lineHeight) || 1.5;
        letterSpacing.value = parseFloat(style.letterSpacing) || 0;
        textTransform.value = style.textTransform || 'none';
        
        if (isIcon) {
            iconSizeInput.value = parseFloat(style.width) || 24;
            iconColorInput.value = rgbToHex(style.color);
        }
        for (const side in paddingInputs) paddingInputs[side].value = parseFloat(style[`padding-${side}`]) || 0;
        for (const side in marginInputs) marginInputs[side].value = parseFloat(style[`margin-${side}`]) || 0;
    }
    
    function updateTextToolbar(element) {
        const isText = element && ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'LI'].includes(element.tagName);
        textToolbar.style.display = isText && isEditingEnabled ? 'flex' : 'none';
        if (isText) {
            const style = getElementStyle(element);
            tagSelector.value = element.tagName;
            fontSelect.value = style.fontFamily.replace(/"/g, '').split(',')[0];
            fontSize.value = parseInt(style.fontSize);
            textColor.value = rgbToHex(style.color);
            
            document.querySelectorAll('.contextual-text-toolbar button[id^="textAlign"]').forEach(btn => btn.classList.remove('active'));
            const currentAlign = style.textAlign;
            if (currentAlign) {
                const activeBtn = document.getElementById(`textAlign${currentAlign.charAt(0).toUpperCase() + currentAlign.slice(1)}`);
                if (activeBtn) activeBtn.classList.add('active');
            }
        }
    }
    
    function applyStyle(property, value, pseudoClass = null) {
        if (!selectedElement) return;
        const useClassSelector = applyToAllToggle.checked && targetClassForApplyAll;
        let selector = useClassSelector ? `.${targetClassForApplyAll}` : getElementSelector(selectedElement);
        
        if (useClassSelector && targetClassForApplyAll === 'cta-btn1') selector = '.cta-btn1, .btn-primary-custom';
        if (useClassSelector && targetClassForApplyAll === 'cta-btn2') selector = '.cta-btn2, .btn-secondary-custom';
        const fullSelector = pseudoClass ? selector.split(',').map(s => `${s.trim()}${pseudoClass}`).join(', ') : selector;
        if (useClassSelector || pseudoClass || (responsiveToggle.checked && currentView !== 'desktop')) {
            updateCssRule(fullSelector, property, value, currentView);
        } else {
            selectedElement.style.setProperty(property, value, 'important');
        }
    }
    
    function applyAttribute(attribute, value) {
        if (!selectedElement) return;
        selectedElement.setAttribute(attribute, value);
    }
    
    function applyLink(url, newWindow) {
        if (!selectedElement) return;
        
        // Get the current element and any parent link
        let link = selectedElement.tagName === 'A' ? selectedElement : selectedElement.closest('a');
        let originalElement = selectedElement;
        
        if (url) {
            // If we need to add a URL but there's no link
            if (!link) {
                // Create a new link element
                const newLink = document.createElement('a');
                
                // Insert the new link before the selected element
                selectedElement.parentNode.insertBefore(newLink, selectedElement);
                
                // Move the selected element into the new link
                newLink.appendChild(selectedElement);
                
                link = newLink;
                selectedElement = link; // Update selected element to the new link
                
                // Update the inspector to show the link properties
                updateInspector(selectedElement);
            }
            
            // Set the link properties
            link.href = url;
            if (newWindow) {
                link.target = '_blank';
            } else {
                link.removeAttribute('target');
            }
        } else if (link) {
            // If URL is cleared and there is a link, unwrap the content
            const parent = link.parentNode;
            
            // Move all children out of the link
            while (link.firstChild) {
                parent.insertBefore(link.firstChild, link);
            }
            
            // Remove the link
            parent.removeChild(link);
            
            // Set the selected element back to the original button
            selectedElement = originalElement;
            
            // Update the inspector to show the button properties
            updateInspector(selectedElement);
        }
        
        addHistoryEntry();
    }

    function applyRichText(command) {
        previewFrame.contentWindow.document.execCommand(command, false, null);
        addHistoryEntry();
    }
// =================================================================
    // 6. CSS RULE MANAGER
    // =================================================================
    const breakpoints = { mobile: '767px', tablet: '1024px' };
    
    function getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        let selector = element.getAttribute('data-editor-id');
        if (!selector) {
            selector = `editor-el-${++editorIdCounter}`;
            element.setAttribute('data-editor-id', selector);
        }
        return `[data-editor-id="${selector}"]`;
    }
    
    function getOrCreateEditorStylesheet() {
        const iframeDoc = previewFrame.contentDocument;
        let styleSheet = iframeDoc.getElementById('editor-responsive-styles');
        if (!styleSheet) {
            styleSheet = iframeDoc.createElement('style');
            styleSheet.id = 'editor-responsive-styles';
            iframeDoc.head.appendChild(styleSheet);
        }
        return styleSheet;
    }
    
    function updateCssRule(selector, property, value, view) {
        const styleSheet = getOrCreateEditorStylesheet();
        const isResponsive = responsiveToggle.checked && view !== 'desktop';
        const breakpoint = breakpoints[view];
        const mediaQuery = isResponsive ? `@media (max-width: ${breakpoint})` : null;
        const sheet = styleSheet.sheet;
        let targetRule = null;
        const rules = mediaQuery ? Array.from(sheet.cssRules).find(r => r.conditionText === `(max-width: ${breakpoint})`)?.cssRules || [] : sheet.cssRules;
        
        for (const rule of rules) {
            if (rule.selectorText === selector) {
                targetRule = rule;
                break;
            }
        }
        
        if (!targetRule) {
            const ruleText = `${selector} { ${property}: ${value} !important; }`;
            if (mediaQuery) {
                let mediaRule = Array.from(sheet.cssRules).find(r => r.conditionText === `(max-width: ${breakpoint})`);
                if (!mediaRule) {
                    sheet.insertRule(`${mediaQuery} {}`, sheet.cssRules.length);
                    mediaRule = sheet.cssRules[sheet.cssRules.length - 1];
                }
                mediaRule.insertRule(ruleText, mediaRule.cssRules.length);
            } else {
                sheet.insertRule(ruleText, sheet.cssRules.length);
            }
        } else {
            targetRule.style.setProperty(property, value, 'important');
        }
    }
    
    function getElementStyle(element, pseudoClass = null) {
        if (!element) return {};
        const iframeWin = previewFrame.contentWindow;
        return iframeWin.getComputedStyle(element, pseudoClass);
    }
 // =================================================================
    // 7. UNDO / REDO HISTORY
    // =================================================================
    function addHistoryEntry() {
        const iframeDoc = previewFrame.contentDocument;
        if (!iframeDoc || !iframeDoc.body) return;
        const currentState = iframeDoc.documentElement.outerHTML;
        if (history[historyIndex] === currentState) return;
        history = history.slice(0, historyIndex + 1);
        history.push(currentState);
        if (history.length > MAX_HISTORY_STEPS) history.shift();
        historyIndex = history.length - 1;
        updateUndoRedoButtons();
    }
    
    function applyHistoryState(state) {
        const iframeDoc = previewFrame.contentDocument;
        const currentScroll = { x: iframeDoc.defaultView.scrollX, y: iframeDoc.defaultView.scrollY };
        
        let selectedElementSelector = null;
        if (selectedElement) {
            selectedElementSelector = getElementSelector(selectedElement);
        }
        iframeDoc.open();
        iframeDoc.write(state);
        iframeDoc.close();
        
        loadGoogleFonts().then(() => {
            setTimeout(() => {
                injectEditableStylesAndListeners();
                previewFrame.contentWindow.scrollTo(currentScroll.x, currentScroll.y);
                
                if (selectedElementSelector) {
                    const newSelectedElement = iframeDoc.querySelector(selectedElementSelector);
                    if (newSelectedElement) {
                        selectedElement = newSelectedElement;
                        selectedElement.classList.add('editable-highlight');
                        updateInspector(selectedElement);
                        updateTextToolbar(selectedElement);
                    } else {
                        selectedElement = null;
                        updateInspector(null);
                        updateTextToolbar(null);
                    }
                } else {
                    selectedElement = null;
                    updateInspector(null);
                    updateTextToolbar(null);
                }
            }, 100);
        });
    }
    
    window.undo = () => {
        if (historyIndex > 0) {
            historyIndex--;
            applyHistoryState(history[historyIndex]);
            updateUndoRedoButtons();
        }
    };
    
    window.redo = () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            applyHistoryState(history[historyIndex]);
            updateUndoRedoButtons();
        }
    };
    
    function updateUndoRedoButtons() {
        undoBtn.disabled = historyIndex <= 0;
        redoBtn.disabled = historyIndex >= history.length - 1;
    }
    
    // =================================================================
    // 8. FONT & ASSET LOADING
    // =================================================================
    const googleFonts = [
        "Inter", "Roboto", "Montserrat", "Poppins", "Lato", "Open Sans",
        "Space Grotesk", "Work Sans", "DM Sans", "Manrope", "Nunito Sans", "IBM Plex Sans"
    ];
    
    function populateFontSelect() {
        fontSelect.innerHTML = ''; // Clear existing
        const systemFonts = ["Arial", "Verdana", "Georgia", "Times New Roman", "Courier New"];
        const allFonts = [...googleFonts, ...systemFonts];
        allFonts.forEach(font => {
            const option = document.createElement('option');
            const fontName = font.split(',')[0];
            option.value = fontName;
            option.textContent = fontName;
            fontSelect.appendChild(option);
        });
    }
    
    function populateTagSelector() {
        const tags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN"];
        tagSelector.innerHTML = '';
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelector.appendChild(option);
        });
    }
    
    function loadGoogleFonts() {
        return new Promise((resolve) => {
            const iframeDoc = previewFrame.contentDocument;
            if (!iframeDoc || iframeDoc.getElementById('google-fonts')) {
                resolve();
                return;
            }
            const fontUrl = `https://fonts.googleapis.com/css2?${googleFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;700`).join('&')}&display=swap`;
            const link = document.createElement('link');
            link.id = 'google-fonts';
            link.rel = 'stylesheet';
            link.href = fontUrl;
            link.onload = resolve;
            iframeDoc.head.appendChild(link);
        });
    }
    
    // =================================================================
    // 9. HEROICONS MODAL & DATA
    // =================================================================
    const heroicons = [
        { name: 'home', category: 'General', outline: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`, solid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" /></svg>`},
        { name: 'user', category: 'General', outline: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>`, solid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" /></svg>`},
    ];
    
    const iconCategoriesList = ["All", ...new Set(heroicons.map(i => i.category))];
    
    function populateIconCategories() {
        iconCategories.innerHTML = '';
        const list = document.createElement('ul');
        iconCategoriesList.forEach(cat => {
            const li = document.createElement('li');
            li.textContent = cat;
            li.dataset.category = cat;
            if (cat === currentIconCategory) li.classList.add('active');
            li.addEventListener('click', () => {
                currentIconCategory = cat;
                document.querySelectorAll('#iconCategories li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                populateHeroiconsModal();
            });
            list.appendChild(li);
        });
        iconCategories.appendChild(list);
    }
    
    function populateHeroiconsModal() {
        heroiconsGrid.innerHTML = '';
        const searchTerm = iconSearchInput.value.toLowerCase();
        
        heroicons
            .filter(icon => currentIconCategory === 'All' || icon.category === currentIconCategory)
            .filter(icon => icon.name.toLowerCase().includes(searchTerm))
            .forEach(icon => {
                const tile = document.createElement('div');
                tile.className = 'icon-tile';
                const svg = currentIconStyle === 'outline' ? icon.outline : icon.solid;
                tile.innerHTML = `${svg}<span>${icon.name}</span>`;
                tile.addEventListener('click', () => handleIconSelection(svg));
                heroiconsGrid.appendChild(tile);
            });
    }
    
    function handleIconSelection(svgString) {
        if (!selectedElement) return;
        
        const newIcon = new DOMParser().parseFromString(svgString, "image/svg+xml").documentElement;
        if (selectedElement.className) newIcon.setAttribute('class', selectedElement.className);
        if (selectedElement.getAttribute('width')) newIcon.setAttribute('width', selectedElement.getAttribute('width'));
        if (selectedElement.getAttribute('height')) newIcon.setAttribute('height', selectedElement.getAttribute('height'));
        if (selectedElement.style.color) newIcon.style.color = selectedElement.style.color;
        
        selectedElement.replaceWith(newIcon);
        selectedElement = newIcon;
        removeEditableHighlights();
        selectedElement.classList.add('editable-highlight');
        closeHeroiconsModal();
        showStatus('Icon replaced.', 'success');
        updateInspector(selectedElement);
        addHistoryEntry();
    }
    
    window.openHeroiconsModal = () => heroiconsModal.style.display = 'flex';
    window.closeHeroiconsModal = () => heroiconsModal.style.display = 'none';
    
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status-${type} show`;
        setTimeout(() => statusDiv.classList.remove('show'), 3000);
    }
    
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || !rgb.startsWith('rgb')) return '#ffffff';
        try {
            let [r, g, b] = rgb.match(/\d+/g).map(Number);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        } catch (e) {
            return '#ffffff';
        }
    }
    
    function isColorDark(hex) {
        if (!hex.startsWith('#')) return false;
        try {
            const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
            return (r * 0.299 + g * 0.587 + b * 0.114) < 186;
        } catch(e) {
            return false;
        }
    }   
   // =================================================================
    // 10. EVENT LISTENERS
    // =================================================================
    function attachEventListeners() {
        const debouncedHistory = debounce(addHistoryEntry, 400);
        
        textContentInput.addEventListener('input', (e) => { if (selectedElement) { selectedElement.innerText = e.target.value; debouncedHistory(); }});
        imageUrlInput.addEventListener('change', (e) => { applyAttribute('src', e.target.value); addHistoryEntry(); });
        imageAltInput.addEventListener('change', (e) => { applyAttribute('alt', e.target.value); addHistoryEntry(); });
        
        // Link controls for buttons and links
        linkUrlInput.addEventListener('change', (e) => { 
            applyLink(e.target.value, linkTargetToggle.checked); 
        });
        
        linkTargetToggle.addEventListener('change', (e) => { 
            applyLink(linkUrlInput.value, e.target.checked); 
        });
        
        bgColorInput.addEventListener('input', (e) => { applyStyle('background-color', e.target.value); debouncedHistory(); });
        bgColorInput.addEventListener('change', addHistoryEntry);
        
        const gradientControls = [gradientColor1, gradientColor2, gradientColor3, gradientDirection];
        gradientControls.forEach(control => {
            control.addEventListener('input', () => {
                const grad = `linear-gradient(${gradientDirection.value}, ${gradientColor1.value}, ${gradientColor2.value}, ${gradientColor3.value})`;
                applyStyle('background-image', grad);
                debouncedHistory();
            });
            control.addEventListener('change', addHistoryEntry);
        });
        
        hoverColorInput.addEventListener('input', (e) => { 
            applyStyle('background-color', e.target.value, ':hover');
            if (isColorDark(e.target.value)) {
                applyStyle('color', '#FFFFFF', ':hover');
                if (hoverTextColorInput) hoverTextColorInput.value = '#FFFFFF';
            }
            debouncedHistory(); 
        });
        hoverColorInput.addEventListener('change', addHistoryEntry);
        
        if (hoverTextColorInput) {
            hoverTextColorInput.addEventListener('input', (e) => { applyStyle('color', e.target.value, ':hover'); debouncedHistory(); });
            hoverTextColorInput.addEventListener('change', addHistoryEntry);
        }
        
        if (hoverBorderColorInput) {
            hoverBorderColorInput.addEventListener('input', (e) => { applyStyle('border-color', e.target.value, ':hover'); applyStyle('border-color', e.target.value, ':focus'); debouncedHistory(); });
            hoverBorderColorInput.addEventListener('change', addHistoryEntry);
        }
        
        if (hoverBgColorInput) {
            hoverBgColorInput.addEventListener('input', (e) => { applyStyle('background-color', e.target.value, ':hover'); applyStyle('background-color', e.target.value, ':focus'); debouncedHistory(); });
            hoverBgColorInput.addEventListener('change', addHistoryEntry);
        }

        borderWidth.addEventListener('input', (e) => { applyStyle('border-width', `${e.target.value}px`); debouncedHistory(); });
        borderWidth.addEventListener('change', addHistoryEntry);
        
        borderStyle.addEventListener('change', (e) => { applyStyle('border-style', e.target.value); addHistoryEntry(); });
        borderColor.addEventListener('input', (e) => { applyStyle('border-color', e.target.value); debouncedHistory(); });
        borderColor.addEventListener('change', addHistoryEntry);
        
        borderRadius.addEventListener('input', (e) => { applyStyle('border-radius', `${e.target.value}px`); debouncedHistory(); });
        borderRadius.addEventListener('change', addHistoryEntry);
        
        boxShadowToggle.addEventListener('change', (e) => {
            const value = e.target.checked ? '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' : 'none';
            applyStyle('box-shadow', value);
            addHistoryEntry();
        });
        
        glowEffectToggle.addEventListener('change', (e) => {
            const mainColor = getElementStyle(selectedElement).borderColor || getElementStyle(selectedElement).backgroundColor || '#3b82f6';
            const glowColor = mainColor.startsWith('rgb') ? mainColor.replace(')', ', 0.3)').replace('rgb', 'rgba') : 'rgba(59, 130, 246, 0.3)';
            const value = e.target.checked ? `0 0 0 4px ${glowColor}` : 'none';
            applyStyle('box-shadow', value, ':hover');
            applyStyle('box-shadow', value, ':focus');
            addHistoryEntry();
        });
        
        widthInput.addEventListener('change', (e) => { applyStyle('width', e.target.value); addHistoryEntry(); });
        heightInput.addEventListener('change', (e) => { applyStyle('height', e.target.value); addHistoryEntry(); });
        displayProperty.addEventListener('change', (e) => {
            applyStyle('display', e.target.value);
            addHistoryEntry();
        });
        
        opacityInput.addEventListener('input', (e) => { applyStyle('opacity', e.target.value); debouncedHistory(); });
        opacityInput.addEventListener('change', addHistoryEntry);
        
        lineHeight.addEventListener('input', (e) => { applyStyle('line-height', e.target.value); debouncedHistory(); });
        lineHeight.addEventListener('change', addHistoryEntry);
        
        letterSpacing.addEventListener('input', (e) => { applyStyle('letter-spacing', `${e.target.value}px`); debouncedHistory(); });
        letterSpacing.addEventListener('change', addHistoryEntry);
        
        textTransform.addEventListener('change', (e) => { applyStyle('text-transform', e.target.value); addHistoryEntry(); });
        
        const toolbarAlignButtons = [textAlignLeft, textAlignCenter, textAlignRight, textAlignJustify];
        toolbarAlignButtons.forEach(button => {
            button.addEventListener('click', () => {
                const alignment = button.id.replace('textAlign', '').toLowerCase();
                applyStyle('text-align', alignment);
                addHistoryEntry();
                updateTextToolbar(selectedElement);
            });
        });
        
        iconSizeInput.addEventListener('input', (e) => { applyStyle('width', `${e.target.value}px`); applyStyle('height', `${e.target.value}px`); debouncedHistory(); });
        iconSizeInput.addEventListener('change', addHistoryEntry);
        
        iconColorInput.addEventListener('input', (e) => { applyStyle('color', e.target.value); debouncedHistory(); });
        iconColorInput.addEventListener('change', addHistoryEntry);
        
        for (const side in paddingInputs) {
            paddingInputs[side].addEventListener('input', (e) => { applyStyle(`padding-${side}`, `${e.target.value}px`); debouncedHistory(); });
            paddingInputs[side].addEventListener('change', addHistoryEntry);
        }
        
        for (const side in marginInputs) {
            marginInputs[side].addEventListener('input', (e) => { applyStyle(`margin-${side}`, `${e.target.value}px`); debouncedHistory(); });
            marginInputs[side].addEventListener('change', addHistoryEntry);
        }
        
        fontSelect.addEventListener('change', (e) => { applyStyle('font-family', e.target.value); addHistoryEntry(); });
        fontSize.addEventListener('input', (e) => { applyStyle('font-size', `${e.target.value}px`); debouncedHistory(); });
        fontSize.addEventListener('change', addHistoryEntry);
        
        textColor.addEventListener('input', (e) => { applyStyle('color', e.target.value); debouncedHistory(); });
        textColor.addEventListener('change', addHistoryEntry);
        
        boldBtn.addEventListener('click', () => applyRichText('bold'));
        italicBtn.addEventListener('click', () => applyRichText('italic'));
        underlineBtn.addEventListener('click', () => applyRichText('underline'));
        
        tagSelector.addEventListener('change', (e) => changeElementTag(e.target.value));
        
        outlineTab.addEventListener('click', () => {
            currentIconStyle = 'outline';
            solidTab.classList.remove('active');
            outlineTab.classList.add('active');
            populateHeroiconsModal();
        });
        
        solidTab.addEventListener('click', () => {
            currentIconStyle = 'solid';
            outlineTab.classList.remove('active');
            solidTab.classList.add('active');
            populateHeroiconsModal();
        });
        
        iconSearchInput.addEventListener('input', populateHeroiconsModal);
        
        if(moveUpBtn) moveUpBtn.addEventListener('click', window.moveElementUp);
        if(moveDownBtn) moveDownBtn.addEventListener('click', window.moveElementDown);
        if(moveLeftBtn) moveLeftBtn.addEventListener('click', window.moveElementLeft);
        if(moveRightBtn) moveRightBtn.addEventListener('click', window.moveElementRight);
        
        sidebarToggleBtn.addEventListener('click', () => {
            elementInspector.classList.toggle('collapsed');
            const icon = sidebarToggleBtn.querySelector('i');
            icon.classList.toggle('fa-chevron-left');
            icon.classList.toggle('fa-chevron-right');
        });
        
        scrollToBottomBtn.addEventListener('click', () => {
            htmlCodeEditorSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    function getIframeContentForExport() {
        const clonedDoc = previewFrame.contentDocument.documentElement.cloneNode(true);
        clonedDoc.querySelectorAll('.editable-highlight, [data-editor-id], #editor-styles, #editor-responsive-styles, #google-fonts').forEach(el => {
            el.classList.remove('editable-highlight');
            el.removeAttribute('data-editor-id');
            if (el.id.startsWith('editor-') || el.id === 'google-fonts') el.remove();
        });
        clonedDoc.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
        return `<!DOCTYPE html>\n` + clonedDoc.outerHTML;
    }
// =================================================================
    // NEW & UPDATED FUNCTIONS
    // =================================================================
    window.deleteElement = function() {
        if (!selectedElement || selectedElement.tagName === 'BODY') {
            showStatus('Cannot delete this element.', 'error');
            return;
        }
        if (confirm('Are you sure you want to delete this element?')) {
            selectedElement.remove();
            selectedElement = null;
            updateInspector(null);
            updateTextToolbar(null);
            showStatus('Element deleted.', 'success');
            addHistoryEntry();
        }
    }
    
    window.copyElement = function() {
        if (!selectedElement || selectedElement.tagName === 'BODY') {
            showStatus('Cannot copy this element.', 'error');
            return;
        }
        const newElement = selectedElement.cloneNode(true);
        newElement.classList.remove('editable-highlight');
        selectedElement.after(newElement);
        showStatus('Element copied.', 'success');
        addHistoryEntry();
    }
    
    window.flipElement = function() {
        if (!selectedElement) return;
        const style = getElementStyle(selectedElement);
        const isTwoColumnFlex = style.display === 'flex' && selectedElement.children.length === 2;
        if (isTwoColumnFlex) {
            selectedElement.classList.toggle('flipped');
            showStatus('Layout flipped.', 'success');
            addHistoryEntry();
        } else {
            showStatus('This is not a 2-column flex container.', 'error');
        }
    }
    
    function updateMovableElementAndActionButtons(element) {
        movableColumnElement = null;
        if (element) {
            let parent = element.parentElement;
            let child = element;
            while (parent && parent.tagName !== 'BODY') {
                const parentStyle = getElementStyle(parent);
                if (parentStyle.display.includes('flex') || parentStyle.display.includes('grid')) {
                    movableColumnElement = child;
                    break;
                }
                child = parent;
                parent = parent.parentElement;
            }
        }
        const elementExists = !!element;
        const isBody = element && element.tagName === 'BODY';
        
        let isFlippable = false;
        if (elementExists && !isBody) {
            const style = getElementStyle(element);
            isFlippable = style.display === 'flex' && element.children.length === 2;
        }
        
        if (deleteBtn) deleteBtn.disabled = !elementExists || isBody;
        if (copyBtn) copyBtn.disabled = !elementExists || isBody;
        if (flipBtn) flipBtn.disabled = !isFlippable;
        if (moveUpBtn) moveUpBtn.disabled = !element || !element.previousElementSibling;
        if (moveDownBtn) moveDownBtn.disabled = !element || !element.nextElementSibling;
        if (moveLeftBtn) moveLeftBtn.disabled = !movableColumnElement || !movableColumnElement.previousElementSibling;
        if (moveRightBtn) moveRightBtn.disabled = !movableColumnElement || !movableColumnElement.nextElementSibling;
    }
    
    window.moveElementUp = function() {
        if (selectedElement && selectedElement.previousElementSibling) {
            selectedElement.parentNode.insertBefore(selectedElement, selectedElement.previousElementSibling);
            addHistoryEntry();
            updateInspector(selectedElement);
        }
    };
    
    window.moveElementDown = function() {
        if (selectedElement && selectedElement.nextElementSibling) {
            selectedElement.parentNode.insertBefore(selectedElement.nextElementSibling, selectedElement);
            addHistoryEntry();
            updateInspector(selectedElement);
        }
    };
    
    window.moveElementLeft = function() {
        if (movableColumnElement && movableColumnElement.previousElementSibling) {
            movableColumnElement.parentNode.insertBefore(movableColumnElement, movableColumnElement.previousElementSibling);
            addHistoryEntry();
            updateInspector(selectedElement);
        }
    };
    
    window.moveElementRight = function() {
        if (movableColumnElement && movableColumnElement.nextElementSibling) {
            movableColumnElement.parentNode.insertBefore(movableColumnElement.nextElementSibling, movableColumnElement);
            addHistoryEntry();
            updateInspector(selectedElement);
        }
    };
    
    window.openSectionModal = function(type) {
        let title = 'Add a New Section';
        let bodyContent = '';
        switch(type) {
            case 'library':
                bodyContent = getSectionLibraryHTML();
                break;
            case 'form':
                title = 'Create a New Form Section';
                bodyContent = getFormCreatorHTML();
                break;
            case 'testimonial':
                title = 'Create a Testimonials Section';
                bodyContent = getTestimonialsCreatorHTML();
                break;
            case 'faq':
                title = 'Create an FAQ Section';
                bodyContent = getFaqCreatorHTML();
                break;
            default:
                showStatus(`Section type "${type}" is not yet implemented.`, 'info');
                return;
        }
sectionModalTitle.textContent = title;
        sectionModalBody.innerHTML = bodyContent;
        sectionModal.style.display = 'flex';
        
        if (type === 'library') {
            sectionModalBody.querySelectorAll('.section-option').forEach(option => {
                option.addEventListener('click', () => {
                    const sectionType = option.dataset.type;
                    openSectionModal(sectionType);
                });
            });
        } else if (type === 'form') {
            // Initialize form tabs
            sectionModalBody.querySelectorAll('.form-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and contents
                    sectionModalBody.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
                    sectionModalBody.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Show corresponding content
                    const tabId = tab.getAttribute('data-tab');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });
            
            // Initialize layout options
            sectionModalBody.querySelectorAll('.layout-option').forEach(option => {
                option.addEventListener('click', () => {
                    sectionModalBody.querySelectorAll('.layout-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            });
        
        } else if (type === 'testimonial') {
            initTestimonialsWizard();
        } else if (type === 'faq') {
            initFaqWizard();
}
    }
    
    window.closeSectionModal = function() {
        sectionModal.style.display = 'none';
        sectionModalBody.innerHTML = '';
    }
    
    function getSectionLibraryHTML() {
        return `
            <div id="sectionLibrary">
                <div class="section-option" data-type="testimonial">
                    <i class="fas fa-comment-alt"></i>
                    <span>Testimonial</span>
                </div>
                <div class="section-option" data-type="faq">
                    <i class="fas fa-question-circle"></i>
                    <span>FAQ</span>
                </div>
                <div class="section-option" data-type="form">
                    <i class="fas fa-file-alt"></i>
                    <span>Form</span>
                </div>
                <div class="section-option" data-type="popup">
                    <i class="fas fa-window-maximize"></i>
                    <span>Popup</span>
                </div>
            </div>
        `;
    }
    
    function getFormCreatorHTML() {
        return `
            <div class="form-creator-container">
                <div class="form-creator-sidebar">
                    <div class="form-tabs">
                        <div class="form-tab active" data-tab="layout">Layout</div>
                        <div class="form-tab" data-tab="content">Content</div>
                        <div class="form-tab" data-tab="fields">Fields</div>
                        <div class="form-tab" data-tab="style">Style</div>
                    </div>
                    
                    <div class="form-tab-content active" id="layout-tab">
                        <div class="form-creator-group">
                            <label>Layout Style</label>
                            <div class="layout-options">
                                <div class="layout-option selected" data-layout="split">
                                    <img src="https://placehold.co/100x60/e0e7ff/4338ca?text=Split" alt="Split Screen Layout">
                                    <span>Split</span>
                                </div>
                                <div class="layout-option" data-layout="centered">
                                    <img src="https://placehold.co/100x60/e0f2fe/0891b2?text=Centered" alt="Centered Layout">
                                    <span>Centered</span>
                                </div>
                                 <div class="layout-option" data-layout="logo-split">
                                    <img src="https://placehold.co/100x60/f3e8ff/7e22ce?text=Logo" alt="Logo Split Layout">
                                    <span>Logo Split</span>
                                </div>
                                <div class="layout-option" data-layout="image-split">
                                    <img src="https://placehold.co/100x60/dcfce7/166534?text=Image" alt="Image Split Layout">
                                    <span>Image Split</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-tab-content" id="content-tab">
                        <div class="form-creator-group">
                            <label>Headline</label>
                            <div class="button-style-grid">
                                <input type="text" id="formHeadline" value="Get In Touch">
                                <select id="formHeadlineTag">
                                    <option value="H2">H2</option>
                                    <option value="H1">H1</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-creator-group">
                            <label for="formSubheadline">Sub-headline / Bullets (One per line)</label>
                            <textarea id="formSubheadline" rows="3">Contact us for a free quote!\n- Fast Service\n- Quality Guaranteed</textarea>
                        </div>
                    </div>
                    
                    <div class="form-tab-content" id="fields-tab">
                        <div class="form-creator-group">
                            <label>Form Fields & Placeholders</label>
                            <div class="placeholder-grid">
                                <label><input type="checkbox" data-field="name" checked> Name</label>
                                <input type="text" id="placeholderName" value="Your Name">
                                <label><input type="checkbox" data-field="email" checked> Email</label>
                                <input type="text" id="placeholderEmail" value="Your Email Address">
                                <label><input type="checkbox" data-field="phone" checked> Phone</label>
                                 <input type="text" id="placeholderPhone" value="Your Phone Number">
                                <label><input type="checkbox" data-field="message"> Message</label>
                                 <select id="messageRows"><option value="1">1 row</option><option value="2">2 rows</option><option value="3" selected>3 rows</option></select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-tab-content" id="style-tab">
                        <div class="form-creator-group">
                            <label>Button</label>
                            <div class="button-style-grid">
                                <input type="text" id="formButtonText" value="Submit">
                                <select id="formButtonShape">
                                    <option value="square">Square</option>
                                    <option value="pill">Pill</option>
                                </select>
                            </div>
                             <select id="formButtonStyle">
                                <option value="cta-btn1">CTA Style 1</option>
                                <option value="inherit">Inherit from Page</option>
                                <option value="cta-btn2">CTA Style 2</option>
                            </select>
                        </div>
                         <div class="form-creator-group">
                            <label class="switch-label">
                               <span>Match Hero Background</span>
                               <label class="switch"><input id="matchHeroBg" type="checkbox"><span class="slider round"></span></label>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-creator-preview">
                    <p style="text-align:center; color: #666;">This feature creates a new section at the bottom of your page with styles inherited from your existing content.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-top-toolbar" onclick="closeSectionModal()">Cancel</button>
                <button class="btn-top-toolbar primary" onclick="createFormSection()">Create Form Section</button>
            </div>
        `;
    }
window.createFormSection = function() {
        const layout = document.querySelector('.layout-option.selected').dataset.layout;
        const headline = document.getElementById('formHeadline').value;
        const headlineTag = document.getElementById('formHeadlineTag').value;
        const subheadline = document.getElementById('formSubheadline').value;
        const buttonText = document.getElementById('formButtonText').value;
        const buttonShape = document.getElementById('formButtonShape').value;
        const buttonStyle = document.getElementById('formButtonStyle').value;
        const matchHeroBg = document.getElementById('matchHeroBg').checked;
        const messageRows = document.getElementById('messageRows').value;
        const fields = [];
        const placeholders = {};
        document.querySelectorAll('.placeholder-grid input[type="checkbox"]:checked').forEach(cb => {
            const fieldName = cb.dataset.field;
            fields.push(fieldName);
            if (fieldName !== 'message') {
                placeholders[fieldName] = document.getElementById(`placeholder${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`).value;
            }
        });
        const isEmailOnly = fields.length === 1 && fields[0] === 'email';
        const inheritedStyles = getInheritedStyles();
        const formHtml = generateFormHTML(layout, headline, headlineTag, subheadline, buttonText, fields, placeholders, isEmailOnly, inheritedStyles, matchHeroBg, buttonShape, buttonStyle, messageRows);
        insertSectionHTML(formHtml);
        closeSectionModal();
        showStatus('Form section created successfully!', 'success');
    }
    
    function getInheritedStyles() {
        const doc = previewFrame.contentDocument;
        const styles = { h1:{}, h2: {}, p: {}, button: {}, section: {}, cta1: {}, cta2: {} };
        const h1 = doc.querySelector('h1');
        if(h1) styles.h1 = getElementStyle(h1);
        
        const h2 = doc.querySelector('h2');
        if (h2) styles.h2 = getElementStyle(h2);
        
        const p = doc.querySelector('p');
        if (p) styles.p = getElementStyle(p);
        
        const btn = doc.querySelector('button, .btn, [type="submit"]');
        if (btn) styles.button = getElementStyle(btn);
        
        const cta1 = doc.querySelector('.cta-btn1, .btn-primary-custom');
        if(cta1) styles.cta1 = getElementStyle(cta1);
        
        const cta2 = doc.querySelector('.cta-btn2, .btn-secondary-custom');
        if(cta2) styles.cta2 = getElementStyle(cta2);
        
        const heroSection = doc.querySelector('section');
        if (heroSection) styles.section = getElementStyle(heroSection);
        return styles;
    }
    
    function generateFormHTML(layout, headline, headlineTag, subheadline, buttonText, fields, placeholders, isEmailOnly, styles, matchHeroBg, buttonShape, buttonStyle, messageRows) {
        const styleToString = (styleObj) => {
            if (!styleObj || !styleObj.length) return '';
            let str = '';
            // Whitelist of properties to copy to avoid layout issues
            const propsToCopy = ['font-family', 'font-size', 'color', 'font-weight', 'line-height', 'text-transform', 'letter-spacing', 'background', 'border', 'padding', 'border-radius'];
            propsToCopy.forEach(prop => {
                if(styleObj.getPropertyValue(prop)) {
                    str += `${prop}: ${styleObj.getPropertyValue(prop)}; `;
                }
            });
            return str;
        };
        
        const headlineStyle = styleToString(headlineTag.toLowerCase() === 'h1' && styles.h1.length ? styles.h1 : styles.h2);
        const pStyle = styleToString(styles.p);
        let btnClasses = 'btn submit-btn';
        let btnStyleStr = '';
        
        if (buttonStyle === 'inherit') {
            btnStyleStr = styleToString(styles.button);
        } else if (buttonStyle === 'cta-btn1' && styles.cta1.length) {
            btnClasses += ' cta-btn1 btn-primary-custom';
        } else if (buttonStyle === 'cta-btn2' && styles.cta2.length) {
            btnClasses += ' cta-btn2 btn-secondary-custom';
        } else {
            // Backup Plan
            const mainColor = styles.h2.color || '#0d6efd';
            btnStyleStr = `background-color: ${mainColor}; color: #ffffff; border: none; padding: 12px 24px; font-size: 16px;`;
            const lighterColor = tinycolor(mainColor).lighten(10).toString();
            updateCssRule('.submit-btn:hover', 'background-color', lighterColor);
        }
        
        if (buttonShape === 'pill') {
            btnStyleStr += 'border-radius: 9999px;';
        } else {
            btnStyleStr += 'border-radius: 6px;';
        }
        
        const sectionStyle = matchHeroBg ? `background: ${styles.section.background};` : 'background-color: #ffffff;';
        const subheadlineItems = subheadline.split('\n').filter(line => line.trim() !== '').map(line => `<li style="display: flex; align-items: start; gap: 10px; margin: 0 0 8px 0; padding: 0;"><span style="color: ${styles.h2.color || '#0d6efd'}; margin-top: 4px; line-height: 1;">&#10003;</span> <span style="${pStyle}; margin: 0; line-height: 1.2;">${line}</span></li>`).join('');
        
        const mainColor = styles.button.backgroundColor || '#0d6efd';
        const lightShade = mainColor.startsWith('rgb') ? mainColor.replace(')', ', 0.05)').replace('rgb','rgba') : '#f0f2f5';
        
        const formFieldsHTML = fields.map(field => {
            const placeholder = placeholders[field] || (field.charAt(0).toUpperCase() + field.slice(1));
            const type = field === 'email' ? 'email' : (field === 'phone' ? 'tel' : 'text');
            if (field === 'message') {
                return `<div style="margin-bottom: 15px;"><textarea class="form-control-generated" name="message" placeholder="Your Message" required rows="${messageRows}" style="width: 100%; padding: 14px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; background-color: #f9fafb; transition: all 0.2s ease;" onfocus="this.style.borderColor='${mainColor}'; this.style.backgroundColor='${lightShade}'; this.style.boxShadow='0 0 0 2px ${lightShade}';" onblur="this.style.borderColor='#ccc'; this.style.backgroundColor='#f9fafb'; this.style.boxShadow='none';"></textarea></div>`;
            }
            return `<div style="margin-bottom: 15px;"><input class="form-control-generated" name="${field}" placeholder="${placeholder}" required type="${type}" style="width: 100%; padding: 14px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px; background-color: #f9fafb; transition: all 0.2s ease;" onfocus="this.style.borderColor='${mainColor}'; this.style.backgroundColor='${lightShade}'; this.style.boxShadow='0 0 0 2px ${lightShade}';" onblur="this.style.borderColor='#ccc'; this.style.backgroundColor='#f9fafb'; this.style.boxShadow='none';"></div>`;
        }).join('');
        
        const hiddenInput = isEmailOnly ? '<input type="hidden" name="name" value="nonameoptin">' : '';
        const formHTML = `
            <form action="?id=${DEFAULT_USER_ID}" method="post" style="margin-top: 20px;">
                ${hiddenInput}
                ${formFieldsHTML}
                <button class="${btnClasses}" type="submit" style="width: 100%; cursor: pointer; ${btnStyleStr}">${buttonText}</button>
            </form>
        `;
        
        let contentHTML = '';
        switch(layout) {
            case 'centered':
                contentHTML = `<div style="max-width: 600px; margin: auto; text-align: center;"><${headlineTag} style="${headlineStyle}; margin: 0 0 8px 0;">${headline}</${headlineTag}><div style="margin: 0 0 24px 0; ${pStyle}">${subheadline.replace(/\n/g, '<br>')}</div>${formHTML}</div>`;
                break;
            case 'logo-split':
                 contentHTML = `<div style="max-width: 800px; margin: auto; text-align: center; border: 1px solid #eee; padding: 40px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); background-color: #fff;"><div style="margin-bottom: 24px;"><img src="https://placehold.co/150x50/cccccc/333333?text=Your+Logo" alt="Company Logo" style="display: inline-block;"></div><${headlineTag} style="${headlineStyle}; margin: 0 0 8px 0;">${headline}</${headlineTag}><div style="display: flex; gap: 40px; text-align: left; margin-top: 24px; align-items: center;"><div style="flex: 1;"><ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0;">${subheadlineItems}</ul></div><div style="flex: 1;">${formHTML}</div></div></div>`;
                break;
            case 'image-split':
                contentHTML = `<div style="display: flex; align-items: center; gap: 40px; max-width: 1100px; margin: auto;"><div style="flex: 1;"><img src="https://placehold.co/600x700/e0e7ff/4338ca?text=Placeholder+Image" alt="Feature image" style="width: 100%; height: 100%; border-radius: 8px; object-fit: cover;"></div><div style="flex: 1; max-width: 450px; text-align: center;"><${headlineTag} style="${headlineStyle}; margin: 0 0 8px 0;">Get Your Special Offer Here</${headlineTag}><p style="${pStyle}; margin: 0 0 16px 0;">A brief, compelling description of the offer goes here.</p><ul style="list-style: none; padding: 0; margin: 0 0 16px 0; display: flex; gap: 16px; justify-content: center; font-size: 14px; ${pStyle}"><li style="display: flex; align-items: center; gap: 8px;">&#10003; This is free</li><li style="display: flex; align-items: center; gap: 8px;">&#10003; Special ends soon</li></ul>${formHTML}</div></div>`;
                break;
            case 'split':
            default:
                contentHTML = `<div style="display: flex; align-items: center; gap: 40px; max-width: 1100px; margin: auto;"><div style="flex: 1; padding: 20px; text-align: center;"><${headlineTag} style="${headlineStyle}; margin: 0 0 8px 0;">${headline}</${headlineTag}><ul style="list-style: none; padding: 0; margin: 16px 0; display: inline-flex; flex-direction: column; gap: 0; text-align: left;">${subheadlineItems}</ul></div><div style="flex: 1; max-width: 400px;">${formHTML}</div></div>`;
                break;
        }
        return `<section style="padding: 60px 20px; ${sectionStyle}">${contentHTML}</section>`;
    }
    
    function insertSectionHTML(html) {
        if (!previewFrame.contentDocument.body) {
            showStatus('Editor not ready. Please wait.', 'error');
            return;
        }
        previewFrame.contentDocument.body.insertAdjacentHTML('beforeend', html);
        addHistoryEntry();
    }
    
    function changeElementTag(newTag) {
        if (!selectedElement || selectedElement.tagName === newTag.toUpperCase()) return;
        const doc = previewFrame.contentDocument;
        const newElement = doc.createElement(newTag);
        while (selectedElement.firstChild) {
            newElement.appendChild(selectedElement.firstChild);
        }
        for (const attr of selectedElement.attributes) {
            if(attr.name.toLowerCase() !== 'style') {
                newElement.setAttribute(attr.name, attr.value);
            }
        }
        
        const inheritedStyles = getInheritedStyles();
        const stylesToApply = inheritedStyles[newTag.toLowerCase()];
        if(stylesToApply && stylesToApply.length) {
            for(let i = 0; i < stylesToApply.length; i++) {
                const prop = stylesToApply[i];
                newElement.style.setProperty(prop, stylesToApply.getPropertyValue(prop), 'important');
            }
        }
        selectedElement.replaceWith(newElement);
        selectedElement = newElement;
        
        removeEditableHighlights();
        selectedElement.classList.add('editable-highlight');
        updateInspector(selectedElement);
        updateTextToolbar(selectedElement);
        addHistoryEntry();
    }

// Modern Popup Creator - Professional Edition
(function() {
    // Add button to toolbar
    const popupBtn = document.createElement('button');
    popupBtn.className = 'btn-top-toolbar';
    popupBtn.innerHTML = '<i class="fas fa-layer-group"></i> Create Popup';
    popupBtn.style.backgroundColor = '#4f46e5';
    popupBtn.style.color = 'white';
    
    // Default user ID
    const DEFAULT_USER_ID = '2581';
    
    // Add button to toolbar
    window.addEventListener('load', function() {
        setTimeout(() => {
            const toolbar = document.querySelector('.top-toolbar-left');
            if (toolbar) {
                toolbar.appendChild(popupBtn);
                console.log('Modern popup creator added');
            }
        }, 1000);
    });
    
    // Open popup creator when button is clicked
    popupBtn.addEventListener('click', openPopupCreator);
    
    // Function to open popup creator
    function openPopupCreator() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '10000';
        
        // Create modal
        overlay.innerHTML = `
            <div style="background: white; border-radius: 16px; width: 90%; max-width: 1000px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid #f3f4f6;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">Create High-Converting Popup</h2>
                    <button id="close-modal" style="background: none; border: none; cursor: pointer; font-size: 24px; color: #9ca3af;">&times;</button>
                </div>
                
                <!-- Content Area -->
                <div style="display: flex; height: calc(90vh - 140px); overflow: hidden;">
                    <!-- Left sidebar -->
                    <div style="width: 280px; background: #f9fafb; border-right: 1px solid #f3f4f6; padding: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
                        <!-- Step 1: Button Selection -->
                        <div class="creator-step" data-step="1" style="margin-bottom: 15px;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #111827;">Step 1: Select Button</h3>
                            <p style="margin: 0 0 15px 0; font-size: 14px; color: #6b7280;">Choose the button to connect your popup to</p>
                            <button id="select-button-btn" style="width: 100%; padding: 10px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <i class="fas fa-mouse-pointer"></i> Select Button
                            </button>
                            <div id="selected-button-info" style="margin-top: 10px; padding: 10px; background: #f3f4f6; border-radius: 6px; font-size: 13px; color: #6b7280;">
                                No button selected
                            </div>
                        </div>
                        
                        <!-- Step 2: Template Selection -->
                        <div class="creator-step" data-step="2" style="display: none; margin-bottom: 15px;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #111827;">Step 2: Choose Template</h3>
                            <div id="template-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div class="template-option" data-template="modern-centered" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s ease;">
                                    <div style="height: 100px; background: #f5f3ff; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; margin-bottom: 8px;">
                                        <div style="width: 70%; height: 10px; background: #8b5cf6; margin-bottom: 8px; border-radius: 2px;"></div>
                                        <div style="width: 50%; height: 6px; background: #a78bfa; margin-bottom: 15px; border-radius: 2px;"></div>
                                        <div style="width: 80%; height: 8px; background: #ddd6fe; margin-bottom: 5px; border-radius: 2px;"></div>
                                        <div style="width: 80%; height: 8px; background: #ddd6fe; margin-bottom: 10px; border-radius: 2px;"></div>
                                        <div style="width: 60%; height: 10px; background: #8b5cf6; border-radius: 5px;"></div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 500; text-align: center; color: #4b5563;">Modern Centered</div>
                                </div>
                                <div class="template-option" data-template="split-image" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s ease;">
                                    <div style="height: 100px; background: #eff6ff; border-radius: 6px; display: flex; padding: 10px; margin-bottom: 8px;">
                                        <div style="width: 40%; background: #3b82f6; border-radius: 4px; margin-right: 10px;"></div>
                                        <div style="width: 60%; display: flex; flex-direction: column; justify-content: center;">
                                            <div style="width: 90%; height: 8px; background: #60a5fa; margin-bottom: 8px; border-radius: 2px;"></div>
                                            <div style="width: 70%; height: 6px; background: #93c5fd; margin-bottom: 12px; border-radius: 2px;"></div>
                                            <div style="width: 100%; height: 6px; background: #bfdbfe; margin-bottom: 6px; border-radius: 2px;"></div>
                                            <div style="width: 80%; height: 8px; background: #60a5fa; border-radius: 4px;"></div>
                                        </div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 500; text-align: center; color: #4b5563;">Split with Image</div>
                                </div>
                                <div class="template-option" data-template="minimal-card" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s ease;">
                                    <div style="height: 100px; background: #ecfdf5; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; margin-bottom: 8px; position: relative; overflow: hidden;">
                                        <div style="position: absolute; top: 0; right: 0; width: 40px; height: 40px; background: #10b981; border-radius: 0 0 0 40px;"></div>
                                        <div style="width: 60%; height: 10px; background: #10b981; margin-bottom: 8px; border-radius: 2px;"></div>
                                        <div style="width: 80%; height: 6px; background: #6ee7b7; margin-bottom: 15px; border-radius: 2px;"></div>
                                        <div style="width: 70%; height: 8px; background: #d1fae5; margin-bottom: 5px; border-radius: 2px;"></div>
                                        <div style="width: 50%; height: 10px; background: #10b981; border-radius: 5px;"></div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 500; text-align: center; color: #4b5563;">Minimal Card</div>
                                </div>
                                <div class="template-option" data-template="gradient-card" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s ease;">
                                    <div style="height: 100px; background: linear-gradient(135deg, #f43f5e, #ec4899); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; margin-bottom: 8px;">
                                        <div style="width: 70%; height: 10px; background: rgba(255,255,255,0.9); margin-bottom: 8px; border-radius: 2px;"></div>
                                        <div style="width: 50%; height: 6px; background: rgba(255,255,255,0.7); margin-bottom: 15px; border-radius: 2px;"></div>
                                        <div style="width: 80%; height: 8px; background: rgba(255,255,255,0.5); margin-bottom: 5px; border-radius: 2px;"></div>
                                        <div style="width: 60%; height: 10px; background: rgba(255,255,255,0.9); border-radius: 5px;"></div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 500; text-align: center; color: #4b5563;">Gradient Card</div>
                                </div>
                                <!-- New template options added here -->
                                <div class="template-option" data-template="image-left-rectangle" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s ease;">
                                    <div style="height: 100px; background: #fef3c7; border-radius: 6px; display: flex; margin-bottom: 8px;">
                                        <div style="width: 40%; background: #f59e0b; border-radius: 6px 0 0 6px;"></div>
                                        <div style="width: 60%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 10px;">
                                            <div style="width: 80%; height: 10px; background: #d97706; margin-bottom: 8px; border-radius: 2px;"></div>
                                            <div style="width: 70%; height: 6px; background: #fbbf24; margin-bottom: 12px; border-radius: 2px;"></div>
                                            <div style="width: 90%; height: 6px; background: #fcd34d; margin-bottom: 6px; border-radius: 2px;"></div>
                                            <div style="width: 80%; height: 8px; background: #d97706; border-radius: 4px;"></div>
                                        </div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 500; text-align: center; color: #4b5563;">Image Left Rectangle</div>
                                </div>
                                <div class="template-option" data-template="split-rectangle" style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; cursor: pointer; transition: all 0.2s ease;">
                                    <div style="height: 100px; background: #e0f2fe; border-radius: 6px; display: flex; flex-direction: column; margin-bottom: 8px;">
                                        <div style="height: 30%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5px;">
                                            <div style="width: 60%; height: 6px; background: #0284c7; margin-bottom: 3px; border-radius: 2px;"></div>
                                            <div style="width: 50%; height: 4px; background: #38bdf8; border-radius: 2px;"></div>
                                        </div>
                                        <div style="height: 70%; display: flex;">
                                            <div style="width: 50%; display: flex; flex-direction: column; padding: 5px;">
                                                <div style="width: 80%; height: 6px; background: #0284c7; margin-bottom: 5px; border-radius: 2px;"></div>
                                                <div style="width: 90%; height: 4px; background: #7dd3fc; margin-bottom: 3px; border-radius: 2px;"></div>
                                                <div style="width: 90%; height: 4px; background: #7dd3fc; margin-bottom: 3px; border-radius: 2px;"></div>
                                                <div style="width: 90%; height: 4px; background: #7dd3fc; border-radius: 2px;"></div>
                                            </div>
                                            <div style="width: 50%; display: flex; flex-direction: column; padding: 5px;">
                                                <div style="width: 100%; height: 5px; background: #bae6fd; margin-bottom: 4px; border-radius: 2px;"></div>
                                                <div style="width: 100%; height: 5px; background: #bae6fd; margin-bottom: 4px; border-radius: 2px;"></div>
                                                <div style="width: 80%; height: 6px; background: #0284c7; border-radius: 3px;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="font-size: 13px; font-weight: 500; text-align: center; color: #4b5563;">Split Rectangle</div>
                                </div>
                            </div>
                        </div>
<!-- Step 3: Options -->
                        <div class="creator-step" data-step="3" style="display: none; margin-bottom: 15px;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #111827;">Step 3: Settings</h3>
                            
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Apply to similar buttons</label>
                                <label class="switch-label" style="display: flex; align-items: center;">
                                    <input id="apply-to-all" type="checkbox" checked style="margin-right: 8px;">
                                    <span style="font-size: 13px; color: #6b7280;">Connect to all matching CTA buttons</span>
                                </label>
                            </div>
                            
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Background Style</label>
                                <select id="bg-style" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; background-color: white;">
                                    <option value="solid">Solid Color</option>
                                    <option value="gradient">Gradient</option>
                                    <option value="match-hero">Match Hero Section</option>
                                </select>
                            </div>
                            
                            <div id="bg-color-group" style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Background Color</label>
                                <input id="bg-color" type="color" value="#ffffff" style="width: 100%; height: 36px; padding: 2px; border: 1px solid #d1d5db; border-radius: 6px;">
                            </div>
                            
                            <div id="gradient-group" style="display: none; margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Gradient Colors</label>
                                <div style="display: flex; gap: 8px;">
                                    <input id="gradient-color-1" type="color" value="#4f46e5" style="flex: 1; height: 36px; padding: 2px; border: 1px solid #d1d5db; border-radius: 6px;">
                                    <input id="gradient-color-2" type="color" value="#7c3aed" style="flex: 1; height: 36px; padding: 2px; border: 1px solid #d1d5db; border-radius: 6px;">
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Border Radius</label>
                                <input id="border-radius" type="range" min="0" max="24" value="16" style="width: 100%;">
                                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af;">
                                    <span>0px</span>
                                    <span>12px</span>
                                    <span>24px</span>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #374151;">Button Style</label>
                                <select id="button-style" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; background-color: white;">
                                    <option value="match-cta">Match CTA Button</option>
                                    <option value="custom">Custom Style</option>
                                </select>
                            </div>
                            
                            <div id="custom-button-group" style="display: none; margin-bottom: 12px; padding: 10px; background: #f3f4f6; border-radius: 6px;">
                                <div style="margin-bottom: 8px;">
                                    <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #4b5563;">Button Color</label>
                                    <input id="button-color" type="color" value="#4f46e5" style="width: 100%; height: 30px; padding: 2px; border: 1px solid #d1d5db; border-radius: 4px;">
                                </div>
                                <div style="margin-bottom: 8px;">
                                    <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #4b5563;">Text Color</label>
                                    <input id="button-text-color" type="color" value="#ffffff" style="width: 100%; height: 30px; padding: 2px; border: 1px solid #d1d5db; border-radius: 4px;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 4px; font-size: 13px; color: #4b5563;">Hover Effect</label>
                                    <select id="button-hover" style="width: 100%; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; background-color: white; font-size: 13px;">
                                        <option value="lighten">Lighten</option>
                                        <option value="darken">Darken</option>
                                        <option value="shadow">Shadow Grow</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right content area -->
                    <div style="flex: 1; padding: 20px; overflow-y: auto;">
                        <!-- Content editor -->
                        <div id="content-editor" style="display: none;">
                            <div style="display: flex; border-bottom: 1px solid #f3f4f6; margin-bottom: 20px;">
                                <div id="content-tab" class="editor-tab active" style="padding: 10px 20px; cursor: pointer; border-bottom: 3px solid #4f46e5; color: #4f46e5; font-weight: 600; font-size: 15px;">Content</div>
                                <div id="fields-tab" class="editor-tab" style="padding: 10px 20px; cursor: pointer; border-bottom: 3px solid transparent; color: #9ca3af; font-weight: 600; font-size: 15px;">Form Fields</div>
                                <div id="media-tab" class="editor-tab" style="padding: 10px 20px; cursor: pointer; border-bottom: 3px solid transparent; color: #9ca3af; font-weight: 600; font-size: 15px;">Media</div>
                            </div>
                            
                            <!-- Content Tab Content -->
                            <div id="content-tab-content" class="tab-content" style="display: block;">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Headline</label>
                                    <div style="display: flex; gap: 10px;">
                                        <input id="headline" type="text" value="Get Your Free Guide" style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px;">
                                        <select id="headline-tag" style="width: 80px; padding: 0 12px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
                                            <option value="h2">H2</option>
                                            <option value="h1">H1</option>
                                            <option value="h3">H3</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Subheadline</label>
                                    <textarea id="subheadline" rows="2" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; resize: vertical;">Join thousands of satisfied customers and start seeing results today.</textarea>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Button Text</label>
                                    <input id="button-text" type="text" value="Get It Now" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px;">
                                </div>
                                
                                <div id="bullet-points-container" style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Bullet Points</label>
                                    <textarea id="bullet-points" rows="4" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; resize: vertical;">Premium Features\nUnlimited Access\n24/7 Support</textarea>
                                    <div style="margin-top: 4px; font-size: 13px; color: #6b7280;">One point per line</div>
                                </div>
                            </div>
<!-- Fields Tab Content -->
                            <div id="fields-tab-content" class="tab-content" style="display: none;">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 10px; font-size: 15px; font-weight: 600; color: #374151;">Form Fields</label>
                                    
                                    <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                                <input type="checkbox" data-field="name" checked style="width: 16px; height: 16px; accent-color: #4f46e5;">
                                                <span style="font-weight: 500; color: #374151;">Name Field</span>
                                            </label>
                                            <div style="font-size: 13px; color: #6b7280;">Required</div>
                                        </div>
                                        <input type="text" id="name-placeholder" value="Your Name" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Placeholder text">
                                    </div>
                                    
                                    <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                                <input type="checkbox" data-field="email" checked style="width: 16px; height: 16px; accent-color: #4f46e5;">
                                                <span style="font-weight: 500; color: #374151;">Email Field</span>
                                            </label>
                                            <div style="font-size: 13px; color: #6b7280;">Required</div>
                                        </div>
                                        <input type="text" id="email-placeholder" value="Your Email Address" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Placeholder text">
                                    </div>
                                    
                                    <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                                <input type="checkbox" data-field="phone" style="width: 16px; height: 16px; accent-color: #4f46e5;">
                                                <span style="font-weight: 500; color: #374151;">Phone Field</span>
                                            </label>
                                            <div style="font-size: 13px; color: #6b7280;">Optional</div>
                                        </div>
                                        <input type="text" id="phone-placeholder" value="Your Phone Number" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Placeholder text">
                                    </div>
                                    
                                    <div style="padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                                <input type="checkbox" data-field="message" style="width: 16px; height: 16px; accent-color: #4f46e5;">
                                                <span style="font-weight: 500; color: #374151;">Message Field</span>
                                            </label>
                                            <div style="font-size: 13px; color: #6b7280;">Optional</div>
                                        </div>
                                        <input type="text" id="message-placeholder" value="Your Message" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; margin-bottom: 10px;" placeholder="Placeholder text">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="font-size: 14px; color: #4b5563;">Rows:</span>
                                            <select id="message-rows" style="padding: 5px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: white;">
                                                <option value="2">2</option>
                                                <option value="3" selected>3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Field Style</label>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <div>
                                            <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: #4b5563;">Border Radius</label>
                                            <select id="field-radius" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; background-color: white;">
                                                <option value="0">Square (0px)</option>
                                                <option value="6" selected>Rounded (6px)</option>
                                                <option value="12">Very Rounded (12px)</option>
                                                <option value="9999">Pill Shape</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: #4b5563;">Field Style</label>
                                            <select id="field-style" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; background-color: white;">
                                                <option value="outline" selected>Outlined</option>
                                                <option value="filled">Filled</option>
                                                <option value="minimal">Minimal</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Media Tab Content -->
                            <div id="media-tab-content" class="tab-content" style="display: none;">
                                <div id="image-field-container" style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Image URL</label>
                                    <input id="image-url" type="text" value="https://placehold.co/600x400/4f46e5/ffffff?text=Feature+Image" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px;">
                                    <div style="margin-top: 4px; font-size: 13px; color: #6b7280;">Use a high-quality image for best results</div>
                                </div>
                                
                                <div id="logo-field-container" style="margin-bottom: 20px; display: none;">
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Logo URL</label>
                                    <input id="logo-url" type="text" value="https://placehold.co/200x60/ffffff/333333?text=Your+Logo" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px;">
                                </div>
                                
                                <div>
                                    <label style="display: block; margin-bottom: 8px; font-size: 15px; font-weight: 600; color: #374151;">Preview</label>
                                   <div id="media-preview" style="height: 200px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                        <img id="media-preview-img" src="https://placehold.co/600x400/4f46e5/ffffff?text=Feature+Image" style="max-width: 100%; max-height: 100%;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Popup preview -->
                        <div id="popup-preview-container" style="display: flex; flex-direction: column; height: 100%;">
                            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #111827;">Preview</h3>
                            <div id="popup-preview" style="flex: 1; background-color: #f3f4f6; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
                                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(2px);"></div>
                                <div id="popup-preview-content" style="position: relative; width: 90%; max-width: 500px; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); text-align: center;">
                                    <h2 style="margin-top: 0; color: #111827; font-size: 24px; font-weight: 700;">Get Your Free Guide</h2>
                                    <p style="margin-bottom: 20px; color: #4b5563;">Join thousands of satisfied customers and start seeing results today.</p>
                                    <form style="text-align: left;">
                                        <div style="margin-bottom: 15px;">
                                            <input type="text" placeholder="Your Name" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;">
                                        </div>
                                        <div style="margin-bottom: 15px;">
                                            <input type="email" placeholder="Your Email Address" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;">
                                        </div>
                                        <button type="button" style="width: 100%; padding: 12px; background-color: #4f46e5; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer;">Get It Now</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 20px 30px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <button id="preview-popup-btn" style="padding: 10px 16px; background-color: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; border-radius: 8px; font-weight: 500; cursor: pointer; display: none;">
                            Preview Full Size
                        </button>
                    </div>
                    <div>
                        <button id="cancel-btn" style="padding: 10px 16px; background-color: white; color: #4b5563; border: 1px solid #e5e7eb; border-radius: 8px; font-weight: 500; cursor: pointer; margin-right: 10px;">
                            Cancel
                        </button>
                        <button id="create-popup-btn" style="padding: 10px 20px; background-color: #d1d5db; color: #6b7280; border: none; border-radius: 8px; font-weight: 500; cursor: not-allowed;" disabled>
                            Create Popup
                        </button>
                    </div>
                </div>
            </div>
        `;
// Add overlay to page
        document.body.appendChild(overlay);
        
        // Setup event listeners
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const selectButtonBtn = document.getElementById('select-button-btn');
        const selectedButtonInfo = document.getElementById('selected-button-info');
        const createPopupBtn = document.getElementById('create-popup-btn');
        const previewPopupBtn = document.getElementById('preview-popup-btn');
        const bgStyleSelect = document.getElementById('bg-style');
        const bgColorGroup = document.getElementById('bg-color-group');
        const gradientGroup = document.getElementById('gradient-group');
        const buttonStyleSelect = document.getElementById('button-style');
        const customButtonGroup = document.getElementById('custom-button-group');
        
        // Template and content variables
        let selectedButton = null;
        let selectedTemplate = null;
        
        // Tab switching
        const contentTab = document.getElementById('content-tab');
        const fieldsTab = document.getElementById('fields-tab');
        const mediaTab = document.getElementById('media-tab');
        const contentTabContent = document.getElementById('content-tab-content');
        const fieldsTabContent = document.getElementById('fields-tab-content');
        const mediaTabContent = document.getElementById('media-tab-content');
        
        // Close modal handlers
        closeBtn.addEventListener('click', () => overlay.remove());
        cancelBtn.addEventListener('click', () => overlay.remove());
        
        // Background style toggle
        bgStyleSelect.addEventListener('change', function() {
            bgColorGroup.style.display = this.value === 'solid' ? 'block' : 'none';
            gradientGroup.style.display = this.value === 'gradient' ? 'block' : 'none';
            updatePreview();
        });
        
        // Button style toggle
        buttonStyleSelect.addEventListener('change', function() {
            customButtonGroup.style.display = this.value === 'custom' ? 'block' : 'none';
            updatePreview();
        });
        
        // Tab switching logic
        contentTab.addEventListener('click', () => {
            contentTab.classList.add('active');
            fieldsTab.classList.remove('active');
            mediaTab.classList.remove('active');
            
            contentTab.style.borderBottomColor = '#4f46e5';
            contentTab.style.color = '#4f46e5';
            fieldsTab.style.borderBottomColor = 'transparent';
            fieldsTab.style.color = '#9ca3af';
            mediaTab.style.borderBottomColor = 'transparent';
            mediaTab.style.color = '#9ca3af';
            
            contentTabContent.style.display = 'block';
            fieldsTabContent.style.display = 'none';
            mediaTabContent.style.display = 'none';
        });
        
        fieldsTab.addEventListener('click', () => {
            contentTab.classList.remove('active');
            fieldsTab.classList.add('active');
            mediaTab.classList.remove('active');
            
            contentTab.style.borderBottomColor = 'transparent';
            contentTab.style.color = '#9ca3af';
            fieldsTab.style.borderBottomColor = '#4f46e5';
            fieldsTab.style.color = '#4f46e5';
            mediaTab.style.borderBottomColor = 'transparent';
            mediaTab.style.color = '#9ca3af';
            
            contentTabContent.style.display = 'none';
            fieldsTabContent.style.display = 'block';
            mediaTabContent.style.display = 'none';
        });
        
        mediaTab.addEventListener('click', () => {
            contentTab.classList.remove('active');
            fieldsTab.classList.remove('active');
            mediaTab.classList.add('active');
            
            contentTab.style.borderBottomColor = 'transparent';
            contentTab.style.color = '#9ca3af';
            fieldsTab.style.borderBottomColor = 'transparent';
            fieldsTab.style.color = '#9ca3af';
            mediaTab.style.borderBottomColor = '#4f46e5';
            mediaTab.style.color = '#4f46e5';
            
            contentTabContent.style.display = 'none';
            fieldsTabContent.style.display = 'none';
            mediaTabContent.style.display = 'block';
        });
        
        // Step 1: Select Button
        selectButtonBtn.addEventListener('click', function() {
            overlay.style.display = 'none';
            
            // Show selection instructions
            const instructionDiv = document.createElement('div');
            instructionDiv.style.position = 'fixed';
            instructionDiv.style.top = '50%';
            instructionDiv.style.left = '50%';
            instructionDiv.style.transform = 'translate(-50%, -50%)';
            instructionDiv.style.background = 'rgba(30, 41, 59, 0.9)';
            instructionDiv.style.color = 'white';
            instructionDiv.style.padding = '20px 30px';
            instructionDiv.style.borderRadius = '12px';
            instructionDiv.style.zIndex = '10000';
            instructionDiv.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            instructionDiv.style.maxWidth = '90%';
            instructionDiv.style.textAlign = 'center';
            instructionDiv.innerHTML = `
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Select a Button</h3>
                <p style="margin: 0; font-size: 16px;">Click on any button in your page to connect a popup.</p>
                <div style="margin-top: 15px; font-size: 13px; color: #cbd5e1;">Press ESC to cancel</div>
            `;
            document.body.appendChild(instructionDiv);
            
            // Set up click handler for iframe
            const iframeDoc = previewFrame.contentDocument;
            
            function handleButtonSelection(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const target = e.target;
                if (target.tagName === 'BUTTON' || 
                    (target.tagName === 'A' && target.classList.contains('btn')) || 
                    (target.tagName === 'A' && target.querySelector('button'))) {
                    
                    // Get the actual button (in case of nested elements)
                    selectedButton = target.tagName === 'A' && target.querySelector('button') ? 
                                    target.querySelector('button') : target;
                    
                    // Remove instructions
                    instructionDiv.remove();
                    
                    // Show modal again
                    overlay.style.display = 'flex';
                    
                    // Update selected button info
                    selectedButtonInfo.innerHTML = `
                        <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Selected: ${selectedButton.tagName}</div>
                        <div style="font-size: 12px; color: #6b7280; word-break: break-word;">${selectedButton.innerText || 'No text'}</div>
                    `;
                    selectedButtonInfo.style.background = '#f0fdf4';
                    selectedButtonInfo.style.borderLeft = '3px solid #10b981';
                    
                    // Show step 2
                    document.querySelector('.creator-step[data-step="2"]').style.display = 'block';
                    
                    // Remove event listener
                    iframeDoc.removeEventListener('click', handleButtonSelection, true);
                }
            }
            
            iframeDoc.addEventListener('click', handleButtonSelection, true);
            
            // Add cancel handler (ESC key)
            function handleCancel(e) {
                if (e.key === 'Escape') {
                    instructionDiv.remove();
                    overlay.style.display = 'flex';
                    iframeDoc.removeEventListener('click', handleButtonSelection, true);
                    window.removeEventListener('keydown', handleCancel);
                }
            }
            
            window.addEventListener('keydown', handleCancel);
        });
        
        // Step 2: Template Selection
        document.querySelectorAll('.template-option').forEach(template => {
            template.addEventListener('click', function() {
                // Update selection state
                document.querySelectorAll('.template-option').forEach(t => {
                    t.style.borderColor = '#e5e7eb';
                    t.style.boxShadow = 'none';
                });
                
                this.style.borderColor = '#4f46e5';
                this.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
                
                selectedTemplate = this.dataset.template;
                
                // Update template-specific fields
                updateTemplateSpecificFields(selectedTemplate);
                
                // Show step 3
                document.querySelector('.creator-step[data-step="3"]').style.display = 'block';
                
                // Show content editor
                document.getElementById('popup-preview-container').style.display = 'none';
                document.getElementById('content-editor').style.display = 'block';
                
                // Enable preview button
                previewPopupBtn.style.display = 'block';
                
                // Enable create button
                createPopupBtn.disabled = false;
                createPopupBtn.style.backgroundColor = '#4f46e5';
                createPopupBtn.style.color = 'white';
                createPopupBtn.style.cursor = 'pointer';
                
                // Update preview
                updatePreview();
            });
        });
// Update template specific fields
        function updateTemplateSpecificFields(template) {
            document.getElementById('bullet-points-container').style.display = 
                ['minimal-card', 'gradient-card'].includes(template) ? 'none' : 'block';
            
            document.getElementById('image-field-container').style.display = 
                ['split-image', 'image-left-rectangle'].includes(template) ? 'block' : 'none';
            
            document.getElementById('logo-field-container').style.display = 
                template === 'minimal-card' ? 'block' : 'none';
            
            // Update content
            updateTemplateDefaultContent(template);
        }
        
        // Update template default content
        function updateTemplateDefaultContent(template) {
            const headline = document.getElementById('headline');
            const subheadline = document.getElementById('subheadline');
            const buttonText = document.getElementById('button-text');
            const bulletPoints = document.getElementById('bullet-points');
            const imageUrl = document.getElementById('image-url');
            const logoUrl = document.getElementById('logo-url');
            
            switch(template) {
                case 'modern-centered':
                    headline.value = 'Sign Up Today';
                    subheadline.value = 'Join thousands of satisfied customers and start seeing results.';
                    buttonText.value = 'Get Started';
                    bulletPoints.value = 'Premium Features\nUnlimited Access\n24/7 Support';
                    break;
                case 'split-image':
                    headline.value = 'Get Your Free Guide';
                    subheadline.value = 'Download our step-by-step guide and start seeing results today.';
                    buttonText.value = 'Download Now';
                    bulletPoints.value = 'Proven Methods\nExpert Tips\nActionable Insights';
                    imageUrl.value = 'https://placehold.co/600x400/4f46e5/ffffff?text=Feature+Image';
                    break;
                case 'minimal-card':
                    headline.value = 'Subscribe to Our Newsletter';
                    subheadline.value = 'Get weekly tips and exclusive offers straight to your inbox.';
                    buttonText.value = 'Subscribe';
                    logoUrl.value = 'https://placehold.co/200x60/ffffff/333333?text=Your+Logo';
                    break;
                case 'gradient-card':
                    headline.value = 'Limited Time Offer';
                    subheadline.value = 'Sign up now to get 20% off your first purchase.';
                    buttonText.value = 'Claim Offer';
                    break;
                case 'image-left-rectangle':
                    headline.value = 'Limited Time Offer';
                    subheadline.value = 'Sign up now to get exclusive access to our premium features.';
                    buttonText.value = 'Get Started';
                    imageUrl.value = 'https://placehold.co/800x1200/f59e0b/ffffff?text=Feature+Image';
                    break;
                case 'split-rectangle':
                    headline.value = 'Join Our Community';
                    subheadline.value = 'Get access to exclusive resources and connect with like-minded professionals.';
                    buttonText.value = 'Sign Up Now';
                    bulletPoints.value = 'Premium Resources\nWeekly Expert Sessions\nExclusive Networking Events';
                    break;
            }
            
            // Update media preview
            if (['split-image', 'image-left-rectangle'].includes(template)) {
                document.getElementById('media-preview-img').src = imageUrl.value;
            } else if (template === 'minimal-card') {
                document.getElementById('media-preview-img').src = logoUrl.value;
            }
        }
        
        // Live preview update
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        });
        
        // Update image preview when URL changes
        document.getElementById('image-url').addEventListener('change', function() {
            document.getElementById('media-preview-img').src = this.value;
        });
        
        document.getElementById('logo-url').addEventListener('change', function() {
            document.getElementById('media-preview-img').src = this.value;
        });
        
        // Preview popup in full size
        previewPopupBtn.addEventListener('click', function() {
            if (!selectedTemplate) return;
            
            // Get popup options
            const options = getPopupOptions();
            
            // Generate preview HTML
            const popupHTML = generatePopupHTML(selectedTemplate, options);
            
            // Create preview in iframe
            createPopupPreview(popupHTML);
        });
        
        // Create popup
        createPopupBtn.addEventListener('click', function() {
            if (!selectedButton || !selectedTemplate) return;
            
            // Get popup options
            const options = getPopupOptions();
            
            // Get apply to all setting
            const applyToAll = document.getElementById('apply-to-all').checked;
            
            // Create and connect popup
            createPopup(selectedButton, selectedTemplate, options, applyToAll);
            
            // Close modal
            overlay.remove();
            
            // Show success message
            showStatus('Popup created and connected to button', 'success');
        });
        
        // Initial preview update
        function updatePreview() {
            if (!selectedTemplate) return;
            
            // Get current values
            const headline = document.getElementById('headline').value;
            const headlineTag = document.getElementById('headline-tag').value;
            const subheadline = document.getElementById('subheadline').value;
            const buttonText = document.getElementById('button-text').value;
            
            // Update preview content
            const previewContent = document.getElementById('popup-preview-content');
            if (!previewContent) return;
            
            // Update text content
            previewContent.querySelector('h2').textContent = headline;
            previewContent.querySelector('p').textContent = subheadline;
            previewContent.querySelector('button').textContent = buttonText;
            
            // Update styles
            const borderRadius = document.getElementById('border-radius').value;
            previewContent.style.borderRadius = `${borderRadius}px`;
            
            // Update background
            const bgStyle = document.getElementById('bg-style').value;
            if (bgStyle === 'solid') {
                const bgColor = document.getElementById('bg-color').value;
                previewContent.style.background = bgColor;
            } else if (bgStyle === 'gradient') {
                const color1 = document.getElementById('gradient-color-1').value;
                const color2 = document.getElementById('gradient-color-2').value;
                previewContent.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
            }
            
            // Update button style
            const buttonStyle = document.getElementById('button-style').value;
            const buttonElement = previewContent.querySelector('button');
            
            if (buttonStyle === 'custom') {
                const buttonColor = document.getElementById('button-color').value;
                const buttonTextColor = document.getElementById('button-text-color').value;
                buttonElement.style.backgroundColor = buttonColor;
                buttonElement.style.color = buttonTextColor;
            } else {
                // Default style
                buttonElement.style.backgroundColor = '#4f46e5';
                buttonElement.style.color = 'white';
            }
            
            // Update field styles if applicable
            const fieldStyle = document.getElementById('field-style').value;
            const fieldRadius = document.getElementById('field-radius').value;
            const fieldElements = previewContent.querySelectorAll('input');
            
            fieldElements.forEach(field => {
                field.style.borderRadius = `${fieldRadius}px`;
                
                if (fieldStyle === 'outline') {
                    field.style.border = '1px solid #d1d5db';
                    field.style.backgroundColor = 'white';
                } else if (fieldStyle === 'filled') {
                    field.style.border = '1px solid transparent';
                    field.style.backgroundColor = '#f3f4f6';
                } else if (fieldStyle === 'minimal') {
                    field.style.border = 'none';
                    field.style.borderBottom = '2px solid #d1d5db';
                    field.style.borderRadius = '0';
                    field.style.padding = '12px 2px';
                    field.style.backgroundColor = 'transparent';
                }
            });
        }
    }
// Get all popup options from form
    function getPopupOptions() {
        const options = {
            headline: document.getElementById('headline')?.value || 'Sign Up Today',
            headlineTag: document.getElementById('headline-tag')?.value || 'h2',
            subheadline: document.getElementById('subheadline')?.value || 'Join thousands of satisfied customers',
            buttonText: document.getElementById('button-text')?.value || 'Sign Up',
            bgStyle: document.getElementById('bg-style')?.value || 'solid',
            bgColor: document.getElementById('bg-color')?.value || '#ffffff',
            gradientColor1: document.getElementById('gradient-color-1')?.value || '#4f46e5',
            gradientColor2: document.getElementById('gradient-color-2')?.value || '#7c3aed',
            borderRadius: document.getElementById('border-radius')?.value || '16',
            buttonStyle: document.getElementById('button-style')?.value || 'match-cta',
            buttonColor: document.getElementById('button-color')?.value || '#4f46e5',
            buttonTextColor: document.getElementById('button-text-color')?.value || '#ffffff',
            buttonHover: document.getElementById('button-hover')?.value || 'lighten',
            fieldStyle: document.getElementById('field-style')?.value || 'outline',
            fieldRadius: document.getElementById('field-radius')?.value || '6',
            fields: [],
            bulletPoints: []
        };
        
        // Get bullet points if applicable
        const bulletPointsInput = document.getElementById('bullet-points');
        if (bulletPointsInput && bulletPointsInput.value) {
            options.bulletPoints = bulletPointsInput.value.split('\n').filter(line => line.trim() !== '');
        }
        
        // Get image URL if applicable
        const imageUrlInput = document.getElementById('image-url');
        if (imageUrlInput) {
            options.imageUrl = imageUrlInput.value;
        }
        
        // Get logo URL if applicable
        const logoUrlInput = document.getElementById('logo-url');
        if (logoUrlInput) {
            options.logoUrl = logoUrlInput.value;
        }
        
        // Get form fields
        document.querySelectorAll('input[data-field]:checked').forEach(checkbox => {
            const fieldName = checkbox.dataset.field;
            const placeholder = document.getElementById(`${fieldName}-placeholder`)?.value || 
                            `Your ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
            
            let rows = 3;
            if (fieldName === 'message' && document.getElementById('message-rows')) {
                rows = document.getElementById('message-rows').value;
            }
            
            options.fields.push({
                name: fieldName,
                placeholder: placeholder,
                rows: rows
            });
        });
        
        // Default to name and email if no fields selected
        if (options.fields.length === 0) {
            options.fields = [
                { name: 'name', placeholder: 'Your Name' },
                { name: 'email', placeholder: 'Your Email Address' }
            ];
        }
        
        return options;
    }
    
    // Create popup preview in iframe
    function createPopupPreview(popupHTML) {
        // Add popup to iframe
        const iframeDoc = previewFrame.contentDocument;
        const previewId = 'popup-preview-' + Date.now();
        
        // Create container if it doesn't exist
        let popupContainer = iframeDoc.querySelector('#popup-container');
        if (!popupContainer) {
            popupContainer = document.createElement('div');
            popupContainer.id = 'popup-container';
            iframeDoc.body.appendChild(popupContainer);
        }
        
        // Create preview element
        const previewDiv = document.createElement('div');
        previewDiv.id = previewId;
        previewDiv.className = 'popup-preview';
        previewDiv.style.display = 'block';
        previewDiv.innerHTML = popupHTML;
        
        // Add a preview banner
        const popupContent = previewDiv.querySelector('.popup-content');
        if (popupContent) {
            const previewBanner = document.createElement('div');
            previewBanner.style.position = 'absolute';
            previewBanner.style.top = '0';
            previewBanner.style.left = '0';
            previewBanner.style.width = '100%';
            previewBanner.style.padding = '8px';
            previewBanner.style.backgroundColor = '#f59e0b';
            previewBanner.style.color = '#7c2d12';
            previewBanner.style.fontWeight = 'bold';
            previewBanner.style.fontSize = '14px';
            previewBanner.style.textAlign = 'center';
            previewBanner.style.zIndex = '9999';
            previewBanner.textContent = 'PREVIEW MODE - Click outside to close';
            
            popupContent.style.paddingTop = '40px';
            popupContent.insertBefore(previewBanner, popupContent.firstChild);
        }
        
        // Add to container
        popupContainer.appendChild(previewDiv);
        
        // Add close handler
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                const popup = document.getElementById('${previewId}');
                if (!popup) return;
                
                const overlay = popup.querySelector('.popup-overlay');
                if (overlay) {
                    overlay.addEventListener('click', function(e) {
                        if (e.target === this) {
                            popup.remove();
                        }
                    });
                }
                
                const closeBtn = popup.querySelector('.popup-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        popup.remove();
                    });
                }
                
                // For multi-step popups in preview mode
                const nextStepButtons = popup.querySelectorAll('.popup-next-step');
                nextStepButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const gotoStep = this.getAttribute('data-goto-step');
                        const container = this.closest('.popup-multistep');
                        
                        if (container && gotoStep) {
                            // Hide all steps
                            container.querySelectorAll('.popup-step').forEach(step => {
                                step.style.display = 'none';
                            });
                            
                            // Show target step
                            const targetStep = container.querySelector('.popup-step[data-step="' + gotoStep + '"]');
                            if (targetStep) {
                                targetStep.style.display = 'block';
                                container.setAttribute('data-current-step', gotoStep);
                            }
                        }
                    });
                });
            })();
        `;
        
        iframeDoc.body.appendChild(script);
    }
// Create and connect popup to button
    function createPopup(buttonElement, template, options, applyToAll) {
        const popupId = 'popup-' + Date.now();
        
        // Generate popup HTML
        const popupHTML = generatePopupHTML(template, options);
        
        // Connect popup to buttons
        const iframeDoc = previewFrame.contentDocument;
        
        if (applyToAll && 
            (buttonElement.classList.contains('cta-btn1') || 
             buttonElement.classList.contains('btn-primary-custom') ||
             buttonElement.classList.contains('cta-btn2') || 
             buttonElement.classList.contains('btn-secondary-custom'))) {
            
            // Get the target class
            const targetClass = buttonElement.classList.contains('cta-btn1') || 
                               buttonElement.classList.contains('btn-primary-custom') 
                               ? '.cta-btn1, .btn-primary-custom' 
                               : '.cta-btn2, .btn-secondary-custom';
            
            // Get all matching buttons
            const allButtons = iframeDoc.querySelectorAll(targetClass);
            
            // Connect all buttons to this popup
            allButtons.forEach(btn => {
                btn.setAttribute('data-popup-id', popupId);
                btn.setAttribute('onclick', `showModernPopup('${popupId}'); return false;`);
                
                // If button is in an <a> tag, prevent default navigation
                if (btn.parentElement.tagName === 'A') {
                    btn.parentElement.setAttribute('href', 'javascript:void(0);');
                    btn.parentElement.setAttribute('onclick', `return false;`);
                }
            });
        } else {
            // Connect just this button
            buttonElement.setAttribute('data-popup-id', popupId);
            buttonElement.setAttribute('onclick', `showModernPopup('${popupId}'); return false;`);
            
            // If button is in an <a> tag, prevent default navigation
            if (buttonElement.parentElement.tagName === 'A') {
                buttonElement.parentElement.setAttribute('href', 'javascript:void(0);');
                buttonElement.parentElement.setAttribute('onclick', `return false;`);
            }
        }
        
        // Add popup to page
        let popupContainer = iframeDoc.querySelector('#popup-container');
        if (!popupContainer) {
            popupContainer = document.createElement('div');
            popupContainer.id = 'popup-container';
            iframeDoc.body.appendChild(popupContainer);
        }
        
        // Create popup element
        const popupDiv = document.createElement('div');
        popupDiv.id = popupId;
        popupDiv.className = 'modern-popup';
        popupDiv.style.display = 'none';
        popupDiv.innerHTML = popupHTML;
        popupContainer.appendChild(popupDiv);
        
        // Add popup scripts and styles
        injectPopupResources(iframeDoc);
        
        // Add to history for undo/redo support
        addHistoryEntry();
    }
// Generate popup HTML based on template and options
    function generatePopupHTML(template, options) {
        // Determine background style
        let backgroundStyle = '';
        if (options.bgStyle === 'solid') {
            backgroundStyle = `background-color: ${options.bgColor};`;
        } else if (options.bgStyle === 'gradient') {
            backgroundStyle = `background: linear-gradient(135deg, ${options.gradientColor1}, ${options.gradientColor2});`;
        } else if (options.bgStyle === 'match-hero') {
            const styles = getInheritedStyles();
            if (styles.section && styles.section.background) {
                backgroundStyle = `background: ${styles.section.background};`;
            } else {
                backgroundStyle = `background-color: ${options.bgColor};`;
            }
        }
        
        // Generate form fields HTML
        const formFieldsHTML = generateFormFieldsHTML(options.fields, options.fieldStyle, options.fieldRadius);
        
        // Get button styles
        const buttonStyles = getButtonStyles(options);
        
        // Generate content based on template
        let popupContent = '';
        
        switch(template) {
            case 'modern-centered':
                popupContent = generateModernCenteredHTML(options, formFieldsHTML, buttonStyles);
                break;
            case 'split-image':
                popupContent = generateSplitImageHTML(options, formFieldsHTML, buttonStyles);
                break;
            case 'minimal-card':
                popupContent = generateMinimalCardHTML(options, formFieldsHTML, buttonStyles);
                break;
            case 'gradient-card':
                popupContent = generateGradientCardHTML(options, formFieldsHTML, buttonStyles);
                break;
            case 'image-left-rectangle':
                popupContent = generateImageLeftRectangleHTML(options, formFieldsHTML, buttonStyles);
                break;
            case 'split-rectangle':
                popupContent = generateSplitRectangleHTML(options, formFieldsHTML, buttonStyles);
                break;
            default:
                popupContent = generateModernCenteredHTML(options, formFieldsHTML, buttonStyles);
        }
        
        // Complete popup HTML with base styles
        return `
            <div class="popup-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999;">
                <div class="popup-content" style="${backgroundStyle} border-radius: ${options.borderRadius}px; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-width: ${['image-left-rectangle', 'split-rectangle'].includes(template) ? '70%' : '90%'}; max-height: ${['image-left-rectangle', 'split-rectangle'].includes(template) ? '70vh' : '90vh'}; overflow: auto; width: ${getPopupWidth(template)};">
                    <button class="popup-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; color: #6b7280; cursor: pointer; z-index: 10; transition: color 0.2s;">&times;</button>
                    ${popupContent}
                </div>
            </div>
        `;
    }
    
    // Helper function to determine popup width based on template
    function getPopupWidth(template) {
        switch(template) {
            case 'image-left-rectangle':
            case 'split-rectangle':
                return '900px';
            case 'split-image':
                return '800px';
            case 'minimal-card':
            case 'gradient-card':
            case 'modern-centered':
            default:
                return '580px';
        }
    }
    
    // Generate HTML for Modern Centered template
    function generateModernCenteredHTML(options, formFieldsHTML, buttonStyles) {
        // Generate bullet points if any
        let bulletPointsHTML = '';
        if (options.bulletPoints && options.bulletPoints.length > 0) {
            bulletPointsHTML = `
                <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; text-align: left; display: inline-block;">
                    ${options.bulletPoints.map(point => `
                        <li style="display: flex; align-items: center; margin-bottom: 12px; color: #4b5563; font-size: 16px;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; margin-right: 10px; color: #4f46e5;">
                                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                            </svg>
                            ${point}
                        </li>
                    `).join('')}
                </ul>
            `;
        }
        
        return `
            <div style="padding: 40px; text-align: center;">
                <${options.headlineTag} style="margin-top: 0; margin-bottom: 16px; color: #111827; font-size: ${options.headlineTag === 'h1' ? '28px' : '24px'}; font-weight: 700; line-height: 1.2;">${options.headline}</${options.headlineTag}>
                
                <p style="margin-bottom: 24px; color: #4b5563; font-size: 16px; line-height: 1.5;">${options.subheadline}</p>
                
                ${bulletPointsHTML}
                
                <form action="?id=${DEFAULT_USER_ID}" method="post" style="max-width: 400px; margin: 0 auto; text-align: left;">
                    ${formFieldsHTML}
                    <button class="${buttonStyles.class}" type="submit" style="${buttonStyles.style}">
                        ${options.buttonText}
                    </button>
                </form>
            </div>
        `;
    }
// Generate HTML for Split Image template
    function generateSplitImageHTML(options, formFieldsHTML, buttonStyles) {
        return `
            <div style="display: flex; overflow: hidden;">
                <div style="flex: 1; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <img src="${options.imageUrl}" alt="Feature Image" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
                </div>
                <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <${options.headlineTag} style="margin-top: 0; margin-bottom: 16px; color: #111827; font-size: ${options.headlineTag === 'h1' ? '28px' : '24px'}; font-weight: 700; line-height: 1.2;">${options.headline}</${options.headlineTag}>
                    
                    <p style="margin-bottom: 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">${options.subheadline}</p>
                    
                    <form action="?id=${DEFAULT_USER_ID}" method="post">
                        ${formFieldsHTML}
                        <button class="${buttonStyles.class}" type="submit" style="${buttonStyles.style}">
                            ${options.buttonText}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
    
    // Generate HTML for Minimal Card template
    function generateMinimalCardHTML(options, formFieldsHTML, buttonStyles) {
        return `
            <div style="padding: 40px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background-color: #10b981; border-radius: 0 0 0 100%; opacity: 0.2;"></div>
                
                <div style="text-align: center; margin-bottom: 24px;">
                    <img src="${options.logoUrl}" alt="Logo" style="max-height: 40px; margin-bottom: 20px;">
                    <${options.headlineTag} style="margin: 0 0 12px 0; color: #111827; font-size: ${options.headlineTag === 'h1' ? '28px' : '24px'}; font-weight: 700; line-height: 1.2;">${options.headline}</${options.headlineTag}>
                    <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.5;">${options.subheadline}</p>
                </div>
                
                <form action="?id=${DEFAULT_USER_ID}" method="post" style="max-width: 400px; margin: 0 auto;">
                    ${formFieldsHTML}
                    <button class="${buttonStyles.class}" type="submit" style="${buttonStyles.style}">
                        ${options.buttonText}
                    </button>
                </form>
                
                <div style="position: absolute; bottom: 0; left: 0; width: 80px; height: 80px; background-color: #10b981; border-radius: 0 100% 0 0; opacity: 0.2;"></div>
            </div>
        `;
    }
    
    // Generate HTML for Gradient Card template
    function generateGradientCardHTML(options, formFieldsHTML, buttonStyles) {
        // Override button styles for better contrast on gradient
        const cardButtonStyles = { ...buttonStyles };
        cardButtonStyles.style = cardButtonStyles.style.replace('background-color: #', 'background-color: rgba(255, 255, 255, 0.2); border: 2px solid #fff; color: #fff; backdrop-filter: blur(5px); background-color: #');
        
        return `
            <div style="padding: 40px; background: linear-gradient(135deg, #f43f5e, #ec4899); color: white; text-align: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -100px; right: -100px; width: 200px; height: 200px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -50px; left: -50px; width: 150px; height: 150px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                
                <${options.headlineTag} style="margin-top: 0; margin-bottom: 16px; color: white; font-size: ${options.headlineTag === 'h1' ? '28px' : '24px'}; font-weight: 700; line-height: 1.2; position: relative; z-index: 1;">${options.headline}</${options.headlineTag}>
                
                <p style="margin-bottom: 24px; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.5; position: relative; z-index: 1;">${options.subheadline}</p>
                
                <form action="?id=${DEFAULT_USER_ID}" method="post" style="max-width: 400px; margin: 0 auto; position: relative; z-index: 1;">
                    ${formFieldsHTML.replace(/color: #4b5563;/g, 'color: white;').replace(/background-color: #f9fafb;/g, 'background-color: rgba(255, 255, 255, 0.2);').replace(/border: 1px solid #d1d5db;/g, 'border: 1px solid rgba(255, 255, 255, 0.3);')}
                    <button class="${cardButtonStyles.class}" type="submit" style="${cardButtonStyles.style}">
                        ${options.buttonText}
                    </button>
                </form>
            </div>
        `;
    }
    
    // Generate HTML for Image Left Rectangle template
    function generateImageLeftRectangleHTML(options, formFieldsHTML, buttonStyles) {
        return `
            <div class="popup-template-image-left-rectangle" style="display: flex; min-height: 400px; height: 100%; overflow: hidden;">
                <!-- Left image column -->
                <div style="flex: 0 0 45%; background-image: url('${options.imageUrl}'); background-size: cover; background-position: center;"></div>
                
                <!-- Right content column -->
                <div style="flex: 0 0 55%; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                    <${options.headlineTag} style="margin-top: 0; margin-bottom: 20px; color: #111827; font-size: ${options.headlineTag === 'h1' ? '32px' : '28px'}; font-weight: 700; line-height: 1.2;">${options.headline}</${options.headlineTag}>
                    
                    <p style="margin-bottom: 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">${options.subheadline}</p>
                    
                    <form action="?id=${DEFAULT_USER_ID}" method="post">
                        ${formFieldsHTML}
                        <button class="${buttonStyles.class}" type="submit" style="${buttonStyles.style}">
                            ${options.buttonText}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
// Generate HTML for Split Rectangle template
    function generateSplitRectangleHTML(options, formFieldsHTML, buttonStyles) {
        // Generate bullet points HTML
        const bulletPointsHTML = options.bulletPoints.map(point => `
            <li style="display: flex; align-items: start; margin-bottom: 15px; color: #4b5563; font-size: 16px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; margin-right: 10px; color: #0284c7; flex-shrink: 0; margin-top: 3px;">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                </svg>
                ${point}
            </li>
        `).join('');

        return `
            <div class="popup-template-split-rectangle" style="padding: 0; display: flex; flex-direction: column; min-height: 450px;">
                <!-- Top centered header -->
                <div style="text-align: center; padding: 40px 40px 30px 40px; border-bottom: 1px solid rgba(0,0,0,0.06);">
                    <${options.headlineTag} style="margin-top: 0; margin-bottom: 16px; color: #111827; font-size: ${options.headlineTag === 'h1' ? '32px' : '28px'}; font-weight: 700; line-height: 1.2;">${options.headline}</${options.headlineTag}>
                    <p style="margin: 0 auto; max-width: 600px; color: #4b5563; font-size: 16px; line-height: 1.6;">${options.subheadline}</p>
                </div>
                
                <!-- Bottom split section -->
                <div style="display: flex; flex-grow: 1; padding: 30px 40px 40px 40px;">
                    <!-- Left content column -->
                    <div style="flex: 0 0 45%; padding-right: 30px;">
                        <h3 style="margin-top: 0; margin-bottom: 25px; color: #111827; font-size: 20px; font-weight: 600;">Why Join Us</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${bulletPointsHTML}
                        </ul>
                    </div>
                    
                    <!-- Right form column -->
                    <div style="flex: 0 0 55%; padding-left: 30px; border-left: 1px solid rgba(0,0,0,0.06);">
                        <form action="?id=${DEFAULT_USER_ID}" method="post">
                            ${formFieldsHTML}
                            <button class="${buttonStyles.class}" type="submit" style="${buttonStyles.style}">
                                ${options.buttonText}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate form fields HTML
    function generateFormFieldsHTML(fields, fieldStyle, fieldRadius) {
        if (!fields || fields.length === 0) {
            // Default fields
            fields = [
                {name: 'name', placeholder: 'Your Name'},
                {name: 'email', placeholder: 'Your Email Address'}
            ];
        }
        
        let fieldStyles = '';
        
        // Apply field styles based on settings
        if (fieldStyle === 'outline') {
            fieldStyles = `
                border: 1px solid #d1d5db;
                background-color: white;
                border-radius: ${fieldRadius}px;
                padding: 12px 16px;
            `;
        } else if (fieldStyle === 'filled') {
            fieldStyles = `
                border: 1px solid transparent;
                background-color: #f3f4f6;
                border-radius: ${fieldRadius}px;
                padding: 12px 16px;
            `;
        } else if (fieldStyle === 'minimal') {
            fieldStyles = `
                border: none;
                border-bottom: 2px solid #d1d5db;
                border-radius: 0;
                padding: 12px 4px;
                background-color: transparent;
            `;
        }
        
        return fields.map(field => {
            if (field.name === 'message') {
                return `
                    <div style="margin-bottom: 16px;">
                        <textarea 
                            name="message" 
                            placeholder="${field.placeholder}" 
                            rows="${field.rows || 3}" 
                            style="width: 100%; font-size: 15px; color: #4b5563; ${fieldStyles} transition: all 0.2s ease; outline: none;"
                            onfocus="this.style.borderColor='#4f46e5'; this.style.boxShadow='0 0 0 3px rgba(79, 70, 229, 0.1)';"
                            onblur="this.style.borderColor=''; this.style.boxShadow='';">
                        </textarea>
                    </div>
                `;
            }
            
            const inputType = field.name === 'email' ? 'email' : 
                             (field.name === 'phone' ? 'tel' : 'text');
            
            return `
                <div style="margin-bottom: 16px;">
                    <input 
                        type="${inputType}" 
                        name="${field.name}" 
                        placeholder="${field.placeholder}" 
                        required 
                        style="width: 100%; font-size: 15px; color: #4b5563; ${fieldStyles} transition: all 0.2s ease; outline: none;"
                        onfocus="this.style.borderColor='#4f46e5'; this.style.boxShadow='0 0 0 3px rgba(79, 70, 229, 0.1)';"
                        onblur="this.style.borderColor=''; this.style.boxShadow='';">
                </div>
            `;
        }).join('');
    }
// Get button styles
    function getButtonStyles(options) {
        let buttonClass = 'popup-button';
        let styleString = '';
        
        if (options.buttonStyle === 'match-cta') {
            // Try to match CTA button style from page
            const styles = getInheritedStyles();
            
            if (styles.cta1) {
                buttonClass += ' cta-btn1 btn-primary-custom';
                styleString = extractButtonStyles(styles.cta1);
            } else if (styles.button) {
                styleString = extractButtonStyles(styles.button);
            } else {
                // Default style
                styleString = `
                    background-color: #4f46e5;
                    color: white;
                    border: none;
                    width: 100%;
                    padding: 12px 20px;
                    font-size: 16px;
                    font-weight: 500;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;
            }
        } else if (options.buttonStyle === 'custom') {
            // Use custom button style
            styleString = `
                background-color: ${options.buttonColor};
                color: ${options.buttonTextColor};
                border: none;
                width: 100%;
                padding: 12px 20px;
                font-size: 16px;
                font-weight: 500;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
        }
        
        // Add hover effect
        const hoverEffect = options.buttonHover || 'lighten';
        
        if (hoverEffect === 'lighten') {
            styleString += `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);`;
        } else if (hoverEffect === 'shadow') {
            styleString += `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);`;
        }
        
        return {
            class: buttonClass,
            style: styleString
        };
    }
    
    // Extract button styles from computed style object
    function extractButtonStyles(styleObj) {
        if (!styleObj) return '';
        
        const propertiesToExtract = [
            'background-color', 'color', 'border', 'border-radius',
            'padding', 'font-size', 'font-weight', 'text-transform',
            'box-shadow'
        ];
        
        let styleString = 'width: 100%; '; // Always make buttons full width
        
        propertiesToExtract.forEach(prop => {
            if (styleObj[prop]) {
                styleString += `${prop}: ${styleObj[prop]}; `;
            }
        });
        
        // Add defaults for cursor and transition
        styleString += 'cursor: pointer; transition: all 0.2s ease;';
        
        return styleString;
    }
// Inject popup resources (scripts and styles)
    function injectPopupResources(iframeDoc) {
        // Add popup script if not already present
        if (!iframeDoc.getElementById('modern-popup-script')) {
            const script = document.createElement('script');
            script.id = 'modern-popup-script';
            script.textContent = `
                function showModernPopup(popupId) {
                    const popup = document.getElementById(popupId);
                    if (!popup) return;
                    
                    popup.style.display = 'block';
                    
                    // Add close handlers
                    const closeBtn = popup.querySelector('.popup-close');
                    if (closeBtn) {
                        closeBtn.onclick = function() {
                            popup.style.display = 'none';
                        };
                    }
                    
                    // Close on overlay click
                    const overlay = popup.querySelector('.popup-overlay');
                    if (overlay) {
                        overlay.onclick = function(e) {
                            if (e.target === this) {
                                popup.style.display = 'none';
                            }
                        };
                    }
                    
                    // Setup form fields focus effects
                    const formFields = popup.querySelectorAll('input, textarea');
                    formFields.forEach(field => {
                        field.onfocus = function() {
                            this.style.borderColor = '#4f46e5';
                            this.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                        };
                        
                        field.onblur = function() {
                            this.style.borderColor = '';
                            this.style.boxShadow = '';
                        };
                    });
                    
                    // Setup button hover effects
                    const buttons = popup.querySelectorAll('button[type="submit"]');
                    buttons.forEach(button => {
                        button.onmouseover = function() {
                            if (this.style.backgroundColor && this.style.backgroundColor.includes('rgb')) {
                                // Lighten RGB color
                                const rgb = this.style.backgroundColor.match(/\\d+/g);
                                if (rgb && rgb.length >= 3) {
                                    const r = Math.min(255, parseInt(rgb[0]) + 20);
                                    const g = Math.min(255, parseInt(rgb[1]) + 20);
                                    const b = Math.min(255, parseInt(rgb[2]) + 20);
                                    this.style.backgroundColor = \`rgb(\${r}, \${g}, \${b})\`;
                                }
                            }
                            
                            // Enhance shadow
                            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                            this.style.transform = 'translateY(-1px)';
                        };
                        
                        button.onmouseout = function() {
                            // Reset changes
                            this.style.boxShadow = '';
                            this.style.transform = '';
                        };
                    });
                }
            `;
            iframeDoc.body.appendChild(script);
        }
        
        // Add responsive styles if not already present
        if (!iframeDoc.getElementById('modern-popup-styles')) {
            const style = document.createElement('style');
            style.id = 'modern-popup-styles';
style.textContent = `
    @media (max-width: 768px) {
        /* Basic mobile styling */
        .popup-content {
            max-width: 95% !important;
            width: 95% !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
            margin: auto !important; /* Ensure horizontal centering */
            position: relative !important;
        }
        
        /* Ensure popup overlay properly centers content vertically */
        .popup-overlay {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 10px !important; /* Add some padding to prevent touching edges */
        }
        
        /* Hide image columns completely */
        div[style*="background-image:"] {
            display: none !important;
        }
        
        /* Fix for Split Rectangle template */
        /* Target the header section */
        div[style*="text-align: center; padding: 40px"] {
            padding: 30px 15px !important;
        }
        
        /* Target the split content section */
        div[style*="display: flex; flex-grow: 1"] {
            display: block !important;
        }
        
        /* Target both columns in the split */
        div[style*="display: flex; flex-grow: 1"] > div {
            width: 100% !important;
            max-width: 100% !important;
            flex: none !important;
            padding: 20px 15px !important;
            border: none !important;
        }
        
        /* Add a separator between the columns */
        div[style*="padding-left: 30px; border-left"] {
            border-top: 1px solid rgba(0,0,0,0.1) !important;
            margin-top: 10px !important;
            padding-top: 20px !important;
        }
        
        /* General fixes for all templates */
        div[style*="display: flex"] {
            display: block !important;
        }
        
        div[style*="display: flex"] > div {
            width: 100% !important;
        }
        
        /* Exception for popup overlay to maintain proper centering */
        .popup-overlay[style*="display: flex"] {
            display: flex !important;
            align-items: center !important;
        }
    }
`;
            iframeDoc.head.appendChild(style);
        }
    }
})();

    // ====== Helpers for section builders ======
    function kxIframeDoc(){
        const iframe = document.getElementById('previewFrame');
        return iframe?.contentDocument || iframe?.contentWindow?.document;
    }
    function kxInsertSection(html){
        const doc = kxIframeDoc();
        if (!doc) return;
        const wrap = doc.createElement('div');
        wrap.innerHTML = html.trim();
        const node = wrap.firstElementChild;
        doc.body.appendChild(node);
        if (typeof syncPreviewToEditor === 'function') syncPreviewToEditor();
    }
    function kxBgStyle(mode, opts, fallbackVar){
        if (mode === 'solid') return `background:${opts.c1 || '#f8f9fa'};`;
        if (mode === 'gradient') {
            const dir = opts.dir || '135deg';
            const c1 = opts.c1 || '#1172f4';
            const c2 = opts.c2 || '#0d5cc5';
            return `background:linear(${dir}, ${c1}, ${c2});`;
        }
        return `background: var(${fallbackVar || '--secondary-color'}, #f8f9fa);`;
    }
    // =================================================================
    // 11. NEW SECTION BUILDERS (KX)
    // =================================================================
    const kxSectionStyles = `
        .kx-section { padding: 72px 0; position: relative; }
        .kx-section .kx-inner { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .kx-section .sec-head { text-align: center; margin-bottom: 48px; max-width: 720px; margin-left: auto; margin-right: auto; }
        .kx-section .sec-head h2 { font-size: 2.25rem; font-weight: 700; margin: 0 0 12px; }
        .kx-section .sec-head .sub { font-size: 1.125rem; color: #6b7280; margin: 0; }
        .kx-testimonials .t-row { display: grid; gap: 24px; }
        .kx-testimonials .t-row.cols-1 { grid-template-columns: 1fr; max-width: 640px; margin: 0 auto; }
        .kx-testimonials .t-row.cols-2 { grid-template-columns: repeat(2, 1fr); }
        .kx-testimonials .t-row.cols-3 { grid-template-columns: repeat(3, 1fr); }
        .kx-testimonials .t-row.cols-4 { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 992px) { .kx-testimonials .t-row.cols-3, .kx-testimonials .t-row.cols-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .kx-testimonials .t-row { grid-template-columns: 1fr !important; } }
        .kx-testimonials .t-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; text-align: left; gap: 12px; border: 1px solid rgba(0,0,0,0.05); }
        .kx-testimonials .avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .kx-testimonials .stars { color: #f5b000; font-size: 20px; letter-spacing: 1px; }
        .kx-testimonials .quote { font-style: italic; color: #4b5563; margin: 8px 0; flex-grow: 1; }
        .kx-testimonials .who { margin: 0; font-weight: 600; }
        .kx-testimonials .who span { font-weight: 400; color: #6b7280; }
        .kx-testimonials .t-cta { text-align: center; margin-top: 48px; }
        .kx-testimonials .kx-btn-reviews { display: inline-block; padding: 14px 32px; border-radius: 9999px; font-weight: 700; color: #fff; text-decoration: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.4); transition: all 0.2s ease; }
        .kx-testimonials .kx-btn-reviews:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -5px rgba(139, 92, 246, 0.5); }
        .kx-faq .faq-grid { max-width: 820px; margin: 0 auto; display: grid; gap: 16px; }
        .kx-faq .faq-item { border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); overflow: hidden; transition: all 0.2s ease; }
        .kx-faq .faq-item:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .kx-faq summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; padding: 20px; font-weight: 600; font-size: 1.1rem; }
        .kx-faq summary::-webkit-details-marker { display: none; }
        .kx-faq summary .chev { width: 24px; height: 24px; flex-shrink: 0; margin-left: 16px; transition: transform 0.3s ease; position: relative; }
        .kx-faq summary .chev::before, .kx-faq summary .chev::after { content: ''; position: absolute; top: 50%; left: 50%; width: 12px; height: 2px; background-color: #6b7280; border-radius: 2px; transition: all 0.3s ease; }
        .kx-faq summary .chev::after { transform: translate(-50%, -50%) rotate(90deg); }
        .kx-faq summary .chev::before { transform: translate(-50%, -50%) rotate(0deg); }
        .kx-faq details[open] > summary { color: #4f46e5; }
        .kx-faq details[open] > summary .chev::before { transform: translate(-50%, -50%) rotate(45deg); width: 8px; }
        .kx-faq details[open] > summary .chev::after { transform: translate(-50%, -50%) rotate(-45deg); width: 8px; }
        .kx-faq .a { padding: 0 20px 20px 20px; color: #4b5563; line-height: 1.6; }
    `;

    function getHeroStyles() {
        const doc = previewFrame.contentDocument;
        const win = previewFrame.contentWindow;
        const selectors = ['.hero', 'section.hero', 'header.hero', '[data-hero]', '.hero-section', '.site-hero'];
        let hero = null;
        for (const selector of selectors) {
            hero = doc.querySelector(selector);
            if (hero) break;
        }
        if (!hero) hero = doc.querySelector('section');
        if (!hero) return { background: 'linear-gradient(135deg, rgb(248, 250, 255) 0%, rgb(232, 244, 253) 100%)', fontFamily: 'sans-serif' };

        const style = win.getComputedStyle(hero);
        const background = style.background;
        const fontFamily = style.fontFamily;

        if (!background || background === 'rgba(0, 0, 0, 0)' || background === 'transparent') {
            return { background: 'linear-gradient(135deg, rgb(248, 250, 255) 0%, rgb(232, 244, 253) 100%)', fontFamily };
        }
        return { background, fontFamily };
    }

    function findPrimaryButtonClass() {
        const doc = previewFrame.contentDocument;
        const buttons = doc.querySelectorAll('a, button');
        let bestMatch = null;
        for (const btn of buttons) {
            const className = btn.className.toLowerCase();
            if (typeof className !== 'string') continue;

            const hasBtn = className.includes('btn') || className.includes('button') || className.includes('cta');
            if (!hasBtn) continue;

            const hasPrimary = className.includes('primary') || className.includes('main');
            if (hasPrimary) return btn.className;
            if (!bestMatch) bestMatch = btn.className;
        }
        return bestMatch;
    }

    function injectKxStylesIfNeeded() {
        const doc = previewFrame.contentDocument;
        if (!doc.getElementById('kx-section-styles')) {
            const style = doc.createElement('style');
            style.id = 'kx-section-styles';
            style.textContent = kxSectionStyles;
            doc.head.appendChild(style);
        }
    }

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function getTestimonialsCreatorHTML() {
        return `
        <div class="form-creator-container">
          <div class="form-creator-sidebar">
            <div class="form-tabs">
              <div class="form-tab active" data-tab="t-content">Content</div>
              <div class="form-tab" data-tab="t-style">Style</div>
            </div>
            <div class="form-tab-content active" id="t-content">
                <div class="kx-field"><label>How many testimonials?</label>
                  <input type="number" id="t_count" min="1" max="8" value="3" />
                </div>
                <div class="kx-grid" id="t_items"></div>
                <fieldset class="kx-fieldset">
                  <legend>External Reviews Link</legend>
                  <label class="switch-label">
                    <span>Show a link to an external reviews page</span>
                    <label class="switch"><input id="t_has_ext" type="checkbox"><span class="slider round"></span></label>
                  </label>
                  <div id="t_ext_wrap" class="kx-card" style="display:none; margin-top:10px;">
                    <div class="kx-field"><label>Reviews URL</label>
                      <input type="text" id="t_ext_url" placeholder="https://g.page/r/your-google-place-id" />
                    </div>
                    <div class="kx-field"><label>Button Text</label>
                      <input type="text" id="t_ext_text" value="Click To See All Of Our Reviews" />
                    </div>
                  </div>
                </fieldset>
            </div>
            <div class="form-tab-content" id="t-style">
              <fieldset class="kx-fieldset">
                <legend>Background</legend>
                <label><input type="radio" name="t_bg_mode" value="match-hero" checked> Match Hero Section</label>
                <label><input type="radio" name="t_bg_mode" value="solid"> Solid</label>
                <label><input type="radio" name="t_bg_mode" value="gradient"> Gradient</label>
                <div id="t_bg_solid" class="kx-bg-opt" style="display:none"><input type="color" id="t_bg_solid_color" value="#f8f9fa" /></div>
                <div id="t_bg_grad" class="kx-bg-opt" style="display:none">
                  <input type="color" id="t_bg_grad_c1" value="#e8f4fd" />
                  <input type="color" id="t_bg_grad_c2" value="#f8faff" />
                  <select id="t_bg_grad_dir">
                    <option value="135deg">Diagonal</option>
                    <option value="90deg">Horizontal</option>
                    <option value="180deg">Vertical</option>
                  </select>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="form-creator-preview">
            <p style="text-align:center; color: #666;">A professional testimonials section will be inserted at the bottom of your page.</p>
          </div>
        </div>
        <div class="modal-footer">
            <button class="btn-top-toolbar" onclick="closeSectionModal()">Cancel</button>
            <button class="btn-top-toolbar primary" id="t_build_btn">Insert Section</button>
        </div>`;
    }

    function initTestimonialsWizard() {
        const container = document.getElementById('sectionModalBody');
        container.querySelectorAll('.form-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.form-tab, .form-tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                container.querySelector('#' + tab.dataset.tab).classList.add('active');
            });
        });

        const tCount = container.querySelector('#t_count');
        const tItems = container.querySelector('#t_items');

        function renderTInputs() {
            const n = Math.max(1, Math.min(8, parseInt(tCount.value || '3', 10)));
            tItems.innerHTML = '';
            for (let i = 1; i <= n; i++) {
                const wrap = document.createElement('div');
                wrap.className = 'kx-card';
                wrap.innerHTML = `
                  <h5>Testimonial #${i}</h5>
                  <div class="kx-field"><label>Quote</label><textarea class="t_quote" rows="3" placeholder="Paste review text here..."></textarea></div>
                  <div class="kx-2col">
                    <div class="kx-field"><label>Name</label><input type="text" class="t_name" placeholder="e.g., Sarah T." /></div>
                    <div class="kx-field"><label>Location (Optional)</label><input type="text" class="t_loc" placeholder="e.g., San Diego, CA" /></div>
                  </div>
                  <div class="kx-2col">
                    <div class="kx-field"><label>Star Rating</label>
                      <select class="t_stars">
                        <option value="5" selected>â˜…â˜…â˜…â˜…â˜… (5)</option>
                        <option value="4">â˜…â˜…â˜…â˜…â˜† (4)</option>
                        <option value="3">â˜…â˜…â˜…â˜†â˜† (3)</option>
                      </select>
                    </div>
                    <div class="kx-field"><label>Photo URL (Optional)</label><input type="text" class="t_img" placeholder="https://..." /></div>
                  </div>`;
                tItems.appendChild(wrap);
            }
        }
        tCount.addEventListener('input', renderTInputs);
        renderTInputs();

        container.addEventListener('change', (e) => {
            if (e.target.name === 't_bg_mode') {
                const mode = e.target.value;
                container.querySelector('#t_bg_solid').style.display = (mode === 'solid') ? 'block' : 'none';
                container.querySelector('#t_bg_grad').style.display = (mode === 'gradient') ? 'block' : 'none';
            }
            if (e.target.id === 't_has_ext') {
                container.querySelector('#t_ext_wrap').style.display = e.target.checked ? 'block' : 'none';
            }
        });

        container.querySelector('#t_build_btn').addEventListener('click', () => {
            injectKxStylesIfNeeded();
            const bgMode = container.querySelector('input[name="t_bg_mode"]:checked').value;
            let sectionStyle = '';
            let fontFamily = 'sans-serif';

            if (bgMode === 'match-hero') {
                const heroStyles = getHeroStyles();
                sectionStyle = `background: ${heroStyles.background}; font-family: ${heroStyles.fontFamily};`;
                fontFamily = heroStyles.fontFamily;
            } else if (bgMode === 'solid') {
                sectionStyle = `background: ${container.querySelector('#t_bg_solid_color').value};`;
            } else { // gradient
                const c1 = container.querySelector('#t_bg_grad_c1').value;
                const c2 = container.querySelector('#t_bg_grad_c2').value;
                const dir = container.querySelector('#t_bg_grad_dir').value;
                sectionStyle = `background: linear-gradient(${dir}, ${c1}, ${c2});`;
            }

            const cards = [];
            container.querySelectorAll('#t_items .kx-card').forEach(card => {
                const quote = escapeHtml(card.querySelector('.t_quote').value.trim());
                if (!quote) return;
                const name = escapeHtml(card.querySelector('.t_name').value.trim());
                const loc = escapeHtml(card.querySelector('.t_loc').value.trim());
                const stars = card.querySelector('.t_stars').value;
                const img = escapeHtml(card.querySelector('.t_img').value.trim());
                const starStr = 'â˜…â˜…â˜…â˜…â˜…'.slice(0, stars) + 'â˜†â˜†â˜†â˜†â˜†'.slice(stars);
                const imgHtml = img ? `<img class="avatar" src="${img}" alt="${name || 'Reviewer'}">` : '';
                const locHtml = loc ? `<span>, ${loc}</span>` : '';
                cards.push(`<article class="t-card">${imgHtml}<div class="stars">${starStr}</div><p class="quote">â€œ${quote}â€</p><p class="who"><strong>${name || 'Anonymous'}</strong>${locHtml}</p></article>`);
            });

            if (cards.length === 0) {
                alert('Please add at least one testimonial quote.');
                return;
            }

            const gridCols = (cards.length >= 4) ? 4 : (cards.length === 3 ? 3 : (cards.length === 2 ? 2 : 1));
            let ctaHtml = '';
            if (container.querySelector('#t_has_ext').checked) {
                const extUrl = escapeHtml(container.querySelector('#t_ext_url').value.trim());
                if (!extUrl) { alert('Please enter the Reviews URL or disable the external link.'); return; }
                const extText = escapeHtml(container.querySelector('#t_ext_text').value.trim()) || 'Click To See All Of Our Reviews';
                const btnClass = findPrimaryButtonClass() || 'kx-btn-reviews';
                ctaHtml = `<div class="t-cta"><a class="${btnClass}" href="${extUrl}" target="_blank" rel="noopener">${extText}</a></div>`;
            }

            const html = `
                <section class="kx-section kx-testimonials" style="${sectionStyle}">
                    <div class="kx-inner">
                        <div class="sec-head">
                            <h2>What Our Clients Say</h2>
                            <p class="sub">We are trusted by homeowners and businesses across the county.</p>
                        </div>
                        <div class="t-row cols-${gridCols}">${cards.join('\n')}</div>
                        ${ctaHtml}
                    </div>
                </section>`;

            insertSectionHTML(html);
            addHistoryEntry();
            closeSectionModal();
        });
    }

    function getFaqCreatorHTML() {
        return `
        <div class="form-creator-container">
          <div class="form-creator-sidebar">
            <div class="form-tabs">
              <div class="form-tab active" data-tab="f-content">Content</div>
              <div class="form-tab" data-tab="f-style">Style</div>
            </div>
            <div class="form-tab-content active" id="f-content">
              <div class="kx-field"><label>How many Q&A items?</label>
                <input type="number" id="f_count" min="1" max="12" value="4" />
              </div>
              <div class="kx-grid" id="f_items"></div>
              <div class="kx-field"><label>Start items on page load</label>
                <select id="f_start_mode">
                  <option value="closed" selected>Closed (Recommended)</option>
                  <option value="open">All Open</option>
                </select>
              </div>
            </div>
            <div class="form-tab-content" id="f-style">
              <fieldset class="kx-fieldset">
                <legend>Background</legend>
                <label><input type="radio" name="f_bg_mode" value="match-hero" checked> Match Hero Section</label>
                <label><input type="radio" name="f_bg_mode" value="solid"> Solid</label>
                <label><input type="radio" name="f_bg_mode" value="gradient"> Gradient</label>
                <div id="f_bg_solid" class="kx-bg-opt" style="display:none"><input type="color" id="f_bg_solid_color" value="#ffffff" /></div>
                <div id="f_bg_grad" class="kx-bg-opt" style="display:none">
                  <input type="color" id="f_bg_grad_c1" value="#f8faff" />
                  <input type="color" id="f_bg_grad_c2" value="#e8f4fd" />
                  <select id="f_bg_grad_dir">
                     <option value="135deg">Diagonal</option>
                     <option value="90deg">Horizontal</option>
                     <option value="180deg">Vertical</option>
                  </select>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="form-creator-preview">
            <p style="text-align:center; color: #666;">A professional FAQ section will be inserted at the bottom of your page.</p>
          </div>
        </div>
        <div class="modal-footer">
            <button class="btn-top-toolbar" onclick="closeSectionModal()">Cancel</button>
            <button class="btn-top-toolbar primary" id="f_build_btn">Insert Section</button>
        </div>`;
    }

    function initFaqWizard() {
        const container = document.getElementById('sectionModalBody');
        container.querySelectorAll('.form-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.form-tab, .form-tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                container.querySelector('#' + tab.dataset.tab).classList.add('active');
            });
        });

        const fCount = container.querySelector('#f_count');
        const fItems = container.querySelector('#f_items');

        function renderFInputs() {
            const n = Math.max(1, Math.min(12, parseInt(fCount.value || '4', 10)));
            fItems.innerHTML = '';
            for (let i = 1; i <= n; i++) {
                const wrap = document.createElement('div');
                wrap.className = 'kx-card';
                wrap.innerHTML = `
                  <h5>Question #${i}</h5>
                  <div class="kx-field"><label>Question</label><input type="text" class="f_q" placeholder="Type the question" /></div>
                  <div class="kx-field"><label>Answer</label><textarea class="f_a" rows="3" placeholder="Type the answer"></textarea></div>`;
                fItems.appendChild(wrap);
            }
        }
        fCount.addEventListener('input', renderFInputs);
        renderFInputs();

        container.addEventListener('change', (e) => {
            if (e.target.name === 'f_bg_mode') {
                const mode = e.target.value;
                container.querySelector('#f_bg_solid').style.display = (mode === 'solid') ? 'block' : 'none';
                container.querySelector('#f_bg_grad').style.display = (mode === 'gradient') ? 'block' : 'none';
            }
        });

        container.querySelector('#f_build_btn').addEventListener('click', () => {
            injectKxStylesIfNeeded();
            const bgMode = container.querySelector('input[name="f_bg_mode"]:checked').value;
            let sectionStyle = '';

            if (bgMode === 'match-hero') {
                const heroStyles = getHeroStyles();
                sectionStyle = `background: ${heroStyles.background}; font-family: ${heroStyles.fontFamily};`;
            } else if (bgMode === 'solid') {
                sectionStyle = `background: ${container.querySelector('#f_bg_solid_color').value};`;
            } else { // gradient
                const c1 = container.querySelector('#f_bg_grad_c1').value;
                const c2 = container.querySelector('#f_bg_grad_c2').value;
                const dir = container.querySelector('#f_bg_grad_dir').value;
                sectionStyle = `background: linear-gradient(${dir}, ${c1}, ${c2});`;
            }

            const startMode = container.querySelector('#f_start_mode').value;
            const items = [];
            container.querySelectorAll('#f_items .kx-card').forEach(card => {
                const q = escapeHtml(card.querySelector('.f_q').value.trim());
                const a = escapeHtml(card.querySelector('.f_a').value.trim().replace(/\n/g, '<br>'));
                if (!q || !a) return;
                const openAttr = (startMode === 'open') ? ' open' : '';
                items.push(`<details class="faq-item"${openAttr}><summary><span class="q">${q}</span><span class="chev"></span></summary><div class="a">${a}</div></details>`);
            });

            if (items.length === 0) {
                alert('Please add at least one question and answer.');
                return;
            }

            const html = `
                <section class="kx-section kx-faq" style="${sectionStyle}">
                    <div class="kx-inner">
                        <div class="sec-head">
                            <h2>Frequently Asked Questions</h2>
                            <p class="sub">Here are some of the most common questions we get.</p>
                        </div>
                        <div class="faq-grid">${items.join('\n')}</div>
                    </div>
                </section>`;

            insertSectionHTML(html);
            addHistoryEntry();
            closeSectionModal();
        });
    }
    // ====== Improved Popup Attach Mode (recognize anchors & CTA-like elements) ======
    function isClickableButton(el){
        if (!el || el.nodeType !== 1) return false;
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString();
        const role = el.getAttribute('role');
        const isButtony = (tag==='button') || (tag==='a' && (el.hasAttribute('href') || role==='button'));
        const looksLikeCTA = /(btn|button|cta|call\-to\-action)/i.test(cls);
        const hasClick = !!(el.onclick || el.getAttribute('onclick'));
        return isButtony || looksLikeCTA || hasClick || role==='button';
    }
    function findButtonCandidate(startEl){
        let el = startEl, depth = 0;
        while (el && depth < 4){
            if (isClickableButton(el)) return el;
            el = el.parentElement; depth++;
        }
        return null;
    }
    window.enablePopupAttachMode = function(){
        const iframe = document.getElementById('previewFrame');
        const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
        if (!doc) return;
        const candidates = Array.from(doc.querySelectorAll('*')).filter(isClickableButton);
        candidates.forEach(el=>{
            el.setAttribute('data-kx-attach-candidate','1');
            el.style.outline = '2px dashed rgba(13,92,197,.5)';
            el.style.outlineOffset = '2px';
        });
        const cancel = () => {
            candidates.forEach(el=>{
                if (el.getAttribute('data-kx-attach-candidate')==='1'){
                    el.style.outline=''; el.removeAttribute('data-kx-attach-candidate');
                }
            });
            doc.removeEventListener('click', onDocClick, true);
            doc.removeEventListener('keydown', onKey, true);
        };
        const onKey = (e)=>{ if (e.key==='Escape') cancel(); };
        const onDocClick = (e)=>{
            e.preventDefault(); e.stopPropagation();
            const btn=findButtonCandidate(e.target);
            if (!btn){ alert('That element isnâ€™t a button/CTA. Try another element.'); return; }
            cancel();
            if (typeof openPopupBuilderFor === 'function') {
                openPopupBuilderFor(btn);
            } else {
                showStatus('Popup builder not available in this build, but button was recognized.', 'info');
            }
        };
        doc.addEventListener('click', onDocClick, true);
        doc.addEventListener('keydown', onKey, true);
    };
    const addPopupBtn = document.getElementById('addPopupBtn');
    if (addPopupBtn) addPopupBtn.addEventListener('click', ()=>window.enablePopupAttachMode());
sectionModal.addEventListener('click', (e) => {
        if (e.target === sectionModal) {
            closeSectionModal();
        }
    });
    
    init();
});

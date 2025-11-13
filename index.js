/**
 * Real-time Character Counter
 * A web application that tracks character count with live updates
 */

// DOM Elements
const textareaEl = document.getElementById("textarea");
const totalCounterEl = document.getElementById("total-counter");
const remainingCounterEl = document.getElementById("remaining-counter");
const progressFillEl = document.getElementById("progress-fill");
const progressTextEl = document.getElementById("progress-text");
const clearBtn = document.getElementById("clear-btn");
const copyBtn = document.getElementById("copy-btn");

// Constants
const MAX_LENGTH = textareaEl.getAttribute("maxLength");

/**
 * Initialize the application
 */
function init() {
    updateCounter();
    setupEventListeners();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Text input events
    textareaEl.addEventListener("input", updateCounter);
    textareaEl.addEventListener("keyup", updateCounter);
    textareaEl.addEventListener("paste", handlePaste);
    
    // Button events
    clearBtn.addEventListener("click", clearText);
    copyBtn.addEventListener("click", copyText);
    
    // Focus management
    textareaEl.addEventListener("focus", () => {
        textareaEl.parentElement.classList.add("focused");
    });
    
    textareaEl.addEventListener("blur", () => {
        textareaEl.parentElement.classList.remove("focused");
    });
}

/**
 * Update character counter and progress
 */
function updateCounter() {
    const currentLength = textareaEl.value.length;
    const remaining = MAX_LENGTH - currentLength;
    const percentage = (currentLength / MAX_LENGTH) * 100;
    
    // Update counters
    totalCounterEl.textContent = currentLength;
    remainingCounterEl.textContent = remaining;
    
    // Update progress bar
    progressFillEl.style.width = `${percentage}%`;
    progressTextEl.textContent = `${Math.round(percentage)}%`;
    
    // Add visual feedback
    animateCounter(totalCounterEl);
    
    // Update colors based on usage
    updateVisualState(currentLength, percentage);
}

/**
 * Add animation to counter elements
 */
function animateCounter(element) {
    element.classList.add('counter-update');
    setTimeout(() => {
        element.classList.remove('counter-update');
    }, 300);
}

/**
 * Update visual state based on character count
 */
function updateVisualState(currentLength, percentage) {
    // Update remaining counter color
    if (percentage >= 90) {
        remainingCounterEl.style.color = '#e74c3c';
        progressFillEl.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
    } else if (percentage >= 75) {
        remainingCounterEl.style.color = '#e67e22';
        progressFillEl.style.background = 'linear-gradient(90deg, #e67e22, #d35400)';
    } else {
        remainingCounterEl.style.color = '#2ecc71';
        progressFillEl.style.background = 'linear-gradient(90deg, #2ecc71, #3498db)';
    }
    
    // Update textarea border color
    if (percentage >= 100) {
        textareaEl.style.borderColor = '#e74c3c';
    } else if (textareaEl === document.activeElement) {
        textareaEl.style.borderColor = '#3498db';
    } else {
        textareaEl.style.borderColor = '#e0e0e0';
    }
}

/**
 * Handle paste event to ensure max length is respected
 */
function handlePaste(event) {
    setTimeout(() => {
        if (textareaEl.value.length > MAX_LENGTH) {
            textareaEl.value = textareaEl.value.substring(0, MAX_LENGTH);
        }
        updateCounter();
    }, 0);
}

/**
 * Clear all text from textarea
 */
function clearText() {
    textareaEl.value = '';
    textareaEl.focus();
    updateCounter();
    
    // Visual feedback
    clearBtn.textContent = 'Cleared!';
    setTimeout(() => {
        clearBtn.textContent = 'Clear Text';
    }, 1000);
}

/**
 * Copy text to clipboard
 */
async function copyText() {
    if (!textareaEl.value.trim()) {
        showNotification('No text to copy!', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(textareaEl.value);
        showNotification('Text copied to clipboard!', 'success');
        
        // Visual feedback
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Text';
        }, 1000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy text', 'error');
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const bgColor = type === 'success' ? '#2ecc71' : 
                   type === 'error' ? '#e74c3c' : '#3498db';
    notification.style.backgroundColor = bgColor;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Add notification styles to document
 */
function addNotificationStyles() {
    const styles = `
        .notification {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    init();
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateCounter, clearText, copyText };
}

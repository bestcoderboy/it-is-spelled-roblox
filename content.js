// Copyright 2024 BestSpyBoy (bestcoderboy)
// Licensed under the Apache License, Version 2.0

const CORRECT_SPELLING = "RōBLOX";

// Advanced pattern matching system
class RobloxMatcher {
    constructor() {
        // Base patterns for common misspellings
        this.patterns = [
            // Case variations
            /\bROBLOX\b/g,
            /\broblox\b/g,
            /\bRoblox\b/g,
            /\bROBLOX\b/g,
            /\broBLOX\b/g,
            
            // Common typos
            /\bRoblax\b/g,
            /\bRoblux\b/g,
            /\bRobleox\b/g,
            /\bRobelox\b/g,
            /\bRoblocs\b/g,
            /\bRoblocks\b/g,
            /\bRobox\b/g,
            /\bRobloz\b/g,
            
            // Intentional variations
            /\bR[o0]bl[o0]x\b/gi,
            /\bR[oō0]bl[oō0]x\b/gi,
            /\bR[o0θ]bl[o0θ]x\b/gi,
            
            // Stylized versions
            /\bꋪꄲ꒝꒒ꄲꉧ\b/g,
            /\b尺ㄖ乃ㄥㄖ乂\b/g,
            /\b【R】【O】【B】【L】【O】【X】\b/g,
            
            // Common concatenations
            /\bRBLX\b/gi,
            /\bRBX\b/gi,
            
            // Stretched versions
            /\bR+[Oo0]+[Bb]+[Ll]+[Oo0]+[Xx]+\b/g
        ];

        // Combine patterns for performance
        this.combinedPattern = new RegExp(this.patterns.map(p => p.source).join('|'), 'gi');
        
        // Levenshtein distance threshold for fuzzy matching
        this.DISTANCE_THRESHOLD = 2;
    }

    // Levenshtein distance calculation for fuzzy matching
    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j - 1][i] + 1,
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    // Smart text analysis
    analyzeAndFix(text) {
        // Quick check for any obvious matches
        if (!text.match(/r.*b.*l.*x/i)) return text;

        // First pass: direct pattern replacement
        let result = text.replace(this.combinedPattern, CORRECT_SPELLING);

        // Second pass: fuzzy matching for words that might be Roblox
        const words = result.split(/\b/);
        return words.map(word => {
            // Skip short words and obvious non-matches
            if (word.length < 4 || !/[rb]/i.test(word)) return word;
            
            // Check if this might be a Roblox variant
            const normalized = word.toLowerCase();
            if (this.levenshteinDistance(normalized, CORRECT_SPELLING.toLowerCase()) <= this.DISTANCE_THRESHOLD) {
                // Additional context check to reduce false positives
                if (normalized.includes('r') && normalized.includes('b') && normalized.includes('l')) {
                    return CORRECT_SPELLING;
                }
            }
            return word;
        }).join('');
    }
}

// Initialize matcher
const robloxMatcher = new RobloxMatcher();

// MutationObserver setup
const observer = new MutationObserver((mutations) => {
    const changedNodes = new Set();
    
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    changedNodes.add(node);
                }
            });
        } else if (mutation.type === 'characterData') {
            changedNodes.add(mutation.target.parentNode);
        }
    });
    
    processNodes(changedNodes);
});

// Process text nodes with advanced matching
function processTextNode(node) {
    const oldText = node.nodeValue;
    const newText = robloxMatcher.analyzeAndFix(oldText);
    
    if (oldText !== newText) {
        node.nodeValue = newText;
    }
}

// Process nodes efficiently
function processNodes(nodes) {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
    );

    nodes.forEach(node => {
        let currentNode;
        while (currentNode = walker.nextNode()) {
            processTextNode(currentNode);
        }
    });
}

// Initial processing
processNodes(new Set([document.body]));

// Start observing DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

// Cleanup function
function cleanup() {
    observer.disconnect();
}

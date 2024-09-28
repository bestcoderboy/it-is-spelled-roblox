// Copyright 2024 BestSpyBoy (bestcoderboy)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ----------------------------------------------------------

// this is the objectively correct spelling
const correctSpelling = "Roblox"
const incorrectVersions = [
    "Rōblox", // swear this is literally just VisualPlugin
    "ROBLOX",  // used to be this but it's incorrect now
    "roblox" // just lazy
]

// function to fix the text given by replacing incorrect versions of Roblox
function fixRobloxText(text) {
    incorrectVersions.forEach((incorrectSpelling) => {
        text = text.replaceAll(incorrectSpelling, correctSpelling)
    })
    return text
}

// tell me if i missed any text tags :)
const textTags = [...document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, caption, span, a, strong, i, em, textarea, input, title, abbr, address, blockquote, cite, q, code, ins, pre, div, ul, ol, li, dl, dd, dt, del, sup, sub, small, b')];

// traverses the page to find all text tags
function traverseTags() {
    console.log("changing all tags!")

    const deepNonEmptyTextNodes = el => [...el.childNodes].flatMap(e =>
        e.nodeType === Node.TEXT_NODE && e.textContent.trim() ?
            e : deepNonEmptyTextNodes(e)
    );

    // iterates over all text on a page to fix misspellings of Roblox
    textTags.forEach(tagNode => {
        const textNodes = deepNonEmptyTextNodes(tagNode);
        textNodes.forEach(node => node.nodeValue = fixRobloxText(node.nodeValue))
    })
}

// very performant and efficient!!!
setInterval(traverseTags, 1000)
traverseTags()

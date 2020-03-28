/**
 * 
 * @private
 */
const _pathDel = '/';

/**
 * 
 * @private
 */
const _pathIndex = /\[([0-9]+)\]/m;

/**
 * 
 * @private
 */
const _commentHint = 'comment()';

/**
 * Path class provide a simple API to uniquely identify any DOM node. Inspired
 * by {@link https://es.wikipedia.org/wiki/XPath|XPath} syntax. 
 * @class Path
 */
class Path {
    /**
     * Path._checkNodeType its a void function that raise an {@link TypeError} 
     * if the node provided is undefined or is not a {@link Node}.
     * @private
     * @param {Node} node - Node to check the type.
     */
    static _checkNodeType(node) {
        if (!node || node.nodeType === undefined) {
            throw new TypeError("argument provided is not a Node", "path.js");
        }
    }

    /**
     * Path._childComments function returns the child nodes of the node 
     * provided which are comments.
     * @private
     * @param {Node} node - Parent node to retrieve its childs.
     */
    static _childComments(node) {
        Path._checkNodeType(node);

        if (node.childNodes === null || !node.hasChildNodes()) return [];
        return [...node.childNodes].filter(child => child.nodeType === Document.COMMENT_NODE);
    }

    /**
     * Path._siblings function returns the siblings nodes of provided one which 
     * is comments or has the same tag name.
     * @private
     * @param {Node} node - The node to retrieve its siblings.
     */
    static _siblings(node) {
        Path._checkNodeType(node);
        if (node.parentNode === null) return [];

        return [...node.parentNode.childNodes].filter(sibling => {
            if (node.nodeType === sibling.nodeType) {
                return (node.nodeType === Document.ELEMENT_NODE) ?
                    node.tagName === sibling.tagName :
                    node.nodeType === Document.COMMENT_NODE;
            }

            return false;
        });
    }

    /**
     * Path.fromNode returns the unique identifier path of the provided node. 
     * Iterates over all the provided node antecessors and get some of it's 
     * attributes to create a unique path.
     * @param {Node} node - The node to retreive its path.
     * @returns {string} Returns the unique path as a string.
     */
    static fromNode(node) {
        Path._checkNodeType(node);

        if (
            node.nodeType !== Document.ELEMENT_NODE &&
            node.nodeType !== Document.COMMENT_NODE
        ) return '';
        
        let path = (node.nodeType === Document.ELEMENT_NODE ?
            node.tagName : _commentHint
        ).toLowerCase();

        if (!node.id || node.id === '') {
            let siblings = Path._siblings(node);
            if (siblings.length > 1) path += `[${ siblings.indexOf(node) }]`;
        } else path += `#${ node.id }`;

        return `${ Path.fromNode(node.parentNode) }${ _pathDel }${ path }`;
    }

    /**
     * Path.findNode returns the node identified with the path provided. Searches
     * into the root node provided iterating over all nodes of the path to get 
     * the referenced node.
     * @param {string} path - The identifier path of the referenced node.
     * @param {Node} root - The root node where the referenced node will be search.
     */
    static findNode(path, root) {
        Path._checkNodeType(root);

        let paths = path.split(_pathDel);
        paths.shift(); // Delete root path
        
        let res = root;
        paths.forEach(item => {
            if (res) {
                let index = 0;

                if (_pathIndex.test(item)) {
                    index = Array.from(_pathIndex.exec(item))[0][1];
                    item = item.replace(_pathIndex, '');
                }

                let parents = item.includes(_commentHint) ?
                    Path._childComments(res) : 
                    res.querySelectorAll(item);

                res = parents[index];
            }
        });

        return res;
    }
}

export default Path;
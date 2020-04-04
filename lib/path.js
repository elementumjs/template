/**
 * _pathDel contains de character to delimiter the reference paths.
 * @private
 */
const _pathDel = "/";

/**
 * _pathIndex constant contains a regexp to detect the index of element into a 
 * {@link Path}
 * @private
 */
const _pathIndex = /\[([0-9]+)\]/m;

/**
 * _commentNodeHint constant contains the tag to define a comment element into a 
 * {@link Path}.
 * @private
 */
const _commentNodeHint = "comment()";

/**
 * _textNodeHint constant contains the tag to define a text element into a 
 * {@link Path}.
 * @private
 */
const _textNodeHint = "text()";

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
     * Path._nodeChildComments function returns the child nodes of the node 
     * provided which are comments.
     * @private
     * @param {Node} node - Parent node to retrieve its childs.
     */
    static _nodeChildComments(node) {
        Path._checkNodeType(node);

        if (node.childNodes === null || !node.hasChildNodes()) return [];
        return [...node.childNodes].filter(child => child.nodeType === Node.COMMENT_NODE);
    }

    /**
     * Path._nodeChildTexts function returns the child nodes of the node 
     * provided which are text nodes.
     * @private
     * @param {Node} node - Parent node to retrieve its childs.
     */
    static _nodeChildTexts(node) {
        Path._checkNodeType(node);

        if (node.childNodes === null || !node.hasChildNodes()) return [];
        return [...node.childNodes].filter(child => child.nodeType === Node.TEXT_NODE);
    }

    /**
     * Path._nodeSiblings function returns the siblings nodes that are of the 
     * same type of the provided one, including itself.
     * @private
     * @param {Node} node - The node to retrieve its siblings.
     */
    static _nodeSiblings(node) {
        Path._checkNodeType(node);
        if (node.parentNode === null) return [];

        return [...node.parentNode.childNodes].filter(sibling => {
            if (node.nodeType === sibling.nodeType) {
                return (node.nodeType === Node.ELEMENT_NODE) ?
                    node.tagName === sibling.tagName :
                    node.nodeType === Node.COMMENT_NODE ||
                    node.nodeType === Node.TEXT_NODE;
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
        
        let path;
        if (node.nodeType === Node.ELEMENT_NODE) {
            path = node.tagName.toLowerCase();
        } else if (node.nodeType === Node.COMMENT_NODE) {
            path = _commentNodeHint;
        } else if (node.nodeType === Node.TEXT_NODE) {
            path = _textNodeHint;
        } else return "";

        if (!node.id || node.id === "") {
            let siblings = Path._nodeSiblings(node);
            if (siblings.length > 1) path += `[${ siblings.indexOf(node) }]`;
        } else path += `#${ node.id }`;

        if (!node.parentNode) return path;
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
                    item = item.replace(_pathIndex, "");
                }

                let parents;
                if (item.includes(_commentNodeHint)) {
                    parents = Path._nodeChildComments(res);
                } else if (item.includes(_textNodeHint)) {
                    parents = Path._nodeChildTexts(res);
                } else parents = res.querySelectorAll(item);

                res = parents[index];
            }
        });

        return res;
    }
}

export default Path;
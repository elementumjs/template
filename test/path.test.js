import Path from '../lib/path.js';

test("Path._checkNodeType", () => {
    try { Path._checkNodeType(null) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    try { Path._checkNodeType(true) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    try { Path._checkNodeType(1) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    
    expect(Path._checkNodeType(document.createElement("div"))).toBeUndefined();
});

test("Path._nodeChildComments", () => {
    try { Path._nodeChildComments(null) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    expect(Path._nodeChildComments(document.createElement("div"))).toStrictEqual([]);

    let target = document.createElement("div");
    target.innerHTML = `
        <!--detectableCommentChild-->
        <span>child1</span>
        <div>
            <!--undetectableCommentChild-->
            <span>child2</span>
        </div>
        <!--detectableCommentChild-->
    `;

    let result = Path._nodeChildComments(target); 
    let expected = [
        document.createComment("detectableCommentChild"),
        document.createComment("detectableCommentChild")
    ];
    
    expect(result.length).toBe(2);
    expect(result).toStrictEqual(expected);
});

test("Path._nodeSiblings", () => {
    try { Path._nodeSiblings(null) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    expect(Path._nodeSiblings(document.createElement("div"))).toStrictEqual([]);

    let container = document.createElement("div");
    container.innerHTML = `
        <!--siblingComment-->
        <span id="target"></span>
        <div>
            <!--childComment-->
            <span>childElement</span>
        </div>
        <!--siblingComment-->
        <span>sibling</span>
    `;
    
    let target = container.querySelector("#target");
    let result = Path._nodeSiblings(target); 
    
    expect(result.length).toBe(2);
    result.forEach(sibling => expect(sibling.tagName).toBe("SPAN"));
});

test("Path.fromNode", () => {
    try { Path.fromNode(null) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    try { Path.fromNode(document.createElement("div")) } catch(e) { expect(e).toBeInstanceOf(TypeError); }

    let container = document.createElement("div");
    container.innerHTML = `
        <!--comment-->
        <span></span>
        <div>
            <!--comment-->
            <span></span>
            <!--comment-->
            <span></span>
        </div>
        <!--comment-->
        <span></span>
    `;
    
    let expected = [
        "div/comment()[0]",
        "div/span[0]",
        "div/div",
        "div/div/comment()[0]",
        "div/div/span[0]",
        "div/div/comment()[1]",
        "div/div/span[1]",
        "div/comment()[1]",
        "div/span[1]",
    ]

    let getChilds = (root) => {
        let childs = [];
        (root.childNodes || []).forEach(child => {
            if (
                child.nodeType === Document.ELEMENT_NODE ||
                child.nodeType === Document.COMMENT_NODE
            ) {
                childs.push(child);
                childs.push(...getChilds(child));
            }
        });

        return childs;
    }

    let results = getChilds(container).map(child => Path.fromNode(child));
    expect(results.length).toBe(expected.length);
    expect(results).toStrictEqual(expected);
});

test("Path.findNode", () => {
    try { Path.fromNode(null) } catch(e) { expect(e).toBeInstanceOf(TypeError); }
    try { Path.fromNode(document.createElement("div")) } catch(e) { expect(e).toBeInstanceOf(TypeError); }

    let container = document.createElement("div");
    container.innerHTML = `
        <!--comment-->
        <span></span>
        <div>
            <!--comment-->
            <span></span>
            <!--comment-->
            <span></span>
        </div>
        <!--comment-->
        <span></span>
    `;
    
    let paths = [
        "div/comment()[0]",
        "div/span[0]",
        "div/div",
        "div/div/comment()[0]",
        "div/div/span[0]",
        "div/div/comment()[1]",
        "div/div/span[1]",
        "div/comment()[1]",
        "div/span[1]",
    ]

    let getChilds = (root) => {
        let childs = [];
        (root.childNodes || []).forEach(child => {
            if (
                child.nodeType === Document.ELEMENT_NODE ||
                child.nodeType === Document.COMMENT_NODE
            ) {
                childs.push(child);
                childs.push(...getChilds(child));
            }
        });

        return childs;
    }

    let expected = getChilds(container);
    let results = paths.map(path => Path.findNode(path, container));
    expect(results.length).toBe(expected.length);
    expect(results).toStrictEqual(expected);
});
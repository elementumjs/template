import TValue from "../lib/tvalue.js";

test("TValue.constructor", () => {
    try { new TValue(false); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TValue(12); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { new TValue(); } catch (e) { expect(e).toBeInstanceOf(Error); }

    let refTest = ["test.path", null];
    let ref_path = ["test", "path"];
    let ref_value = null;
    let ref_type = "ref";
    let refResult = new TValue(...refTest);
    expect(refResult._path).toStrictEqual(ref_path);
    expect(refResult._value).toStrictEqual(ref_value);
    expect(refResult._type).toStrictEqual(ref_type);

    let rawTest = [null, 12];
    let raw_path = null;
    let raw_value = 12;
    let raw_type = "raw";
    let rawResult = new TValue(...rawTest);
    expect(rawResult._path).toStrictEqual(raw_path);
    expect(rawResult._value).toStrictEqual(raw_value);
    expect(rawResult._type).toStrictEqual(raw_type);
});

test("TValue.path", () => {
    let target = Object.create(TValue.prototype);
    target._path = ["test", "path"];
    expect(target.path).toStrictEqual("test.path");
});

test("TValue.equalPath", () => {
    let target = Object.create(TValue.prototype);
    target._type === "raw";
    try { target.equalPath(""); } catch(e) { expect(e).toBeInstanceOf(TypeError); }

    target._type = "ref";
    target._path = [ "test", "path" ];
    expect(target.equalPath("test.path")).toBe(true);
    expect(target.equalPath([ "test", "path" ])).toBe(true);
    expect(target.equalPath("test.wrong")).toBe(false);
    try { target.equalPath(null); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
});

test("TValue.fromData", () => {
    let target = Object.create(TValue.prototype);
    target._type = "raw";
    try { target.fromData({ a: "" }); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    target._type = "ref";
    try { target.fromData(null); } catch (e) { expect(e).toBeInstanceOf(TypeError); }
    try { target.fromData({}); } catch (e) { expect(e).toBeInstanceOf(Error); }

    let sourceData = {
        test: {
            path: true
        }
    }
    target._path = ["test", "path"];
    expect(target.fromData(sourceData)).toBe(sourceData.test.path);

    target._path = ["test", "wrong"];
    expect(target.fromData(sourceData)).toBeUndefined();
});
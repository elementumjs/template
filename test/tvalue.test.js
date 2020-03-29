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
    let refPath = "test.path";
    let refTest = [refPath, null];
    let ref_path = ["test", "path"];

    let refResult = new TValue(...refTest);
    expect(refResult._path).toStrictEqual(ref_path);
    expect(refResult.path).toStrictEqual(refPath);
});

test("TValue.equalPath", () => {
    try { new TValue(null, 12).equalPath(""); } catch(e) { expect(e).toBeInstanceOf(Error); }

    let pathStr = "test.path";
    let pathArr = [ "test", "path" ];
    let wrongPath = "test.wrong";
    let badPath = null;
    let target = new TValue(pathStr, null);

    expect(target.equalPath(pathStr)).toBe(true);
    expect(target.equalPath(pathArr)).toBe(true);
    expect(target.equalPath(wrongPath)).toBe(false);
    try { target.equalPath(badPath); } catch (e) { expect(e).toBeInstanceOf(Error); }
});

test("TValue.fromData", () => {
    try { new TValue(null, true).fromData({}); } catch (e) { expect(e).toBeInstanceOf(Error); }

    let sourceData = {
        test: {
            path: true
        }
    }
    let goodPath = "test.path";
    expect(new TValue(goodPath, null).fromData(sourceData)).toBe(sourceData.test.path);

    let wrogPath = "test.wrong";
    expect(new TValue(wrogPath, null).fromData(sourceData)).toBeUndefined();
});
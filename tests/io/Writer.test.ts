import ByteStream from '../../io/ByteStream'
import Writer from '../../io/serializers/Writer'

test('test boolean serialization', () => {
    let writer = new Writer(new ByteStream());
    writer.write(true);
    writer.write(false);
    writer.serialize(true);
    writer.serialize(false);
    writer.serialize(new Boolean(true));
    writer.serialize(new Boolean(false));
    expect(writer.stream.toString()).toBe('tftftf');
});

test('test null serialization', () => {
    let writer = new Writer(new ByteStream());
    writer.write(null);
    writer.write(undefined);
    writer.serialize(function() {});
    writer.serialize(()=>{});
    writer.serialize(function*() {yield 1;});
    writer.serialize(async function(){});
    writer.serialize(async()=>{});
    expect(writer.stream.toString()).toBe('nnnnnnn');
});

test('test array serialization', () => {
    let writer = new Writer(new ByteStream());
    (function(x, y, z) {
        writer.write(arguments);
    })(1, 2, 3);
    writer.write([4, 5, 6]);
    expect(writer.stream.toString()).toBe('a3{123}a3{456}');
});

test('test map serialization', () => {
    let writer = new Writer(new ByteStream());
    writer.write(Object.create(null));
    writer.write({});
    writer.write({name: "Tom", age: 18});
    let map = new Map<string, any>();
    map.set("name", "Jerry");
    map.set("age", 17);
    writer.serialize(map);
    writer.serialize(map);
    expect(writer.stream.toString()).toBe('m{}m{}m2{s4"name"s3"Tom"s3"age"i18;}m2{r3;s5"Jerry"r5;i17;}r6;');
});

test('test object serialization', () => {
        class User {
        public name: string = '';
        public age: number = 0;
    }
    let user = new User();
    user.name = "Tom";
    user.age = 18;
    let user2 = new User();
    user2.name = "Jerry";
    user2.age = 17;
    let writer = new Writer(new ByteStream());
    writer.write(user);
    writer.write(user2);
    expect(writer.stream.toString()).toBe('c4"User"2{s4"name"s3"age"}o0{s3"Tom"i18;}o0{s5"Jerry"i17;}');
})

// hproseWriter.serialize(undefined);
// hproseWriter.serialize(null);
// hproseWriter.serialize(0);
// hproseWriter.serialize(9);
// hproseWriter.serialize(-1);
// hproseWriter.serialize(10);
// hproseWriter.serialize(121234567109.6543);
// hproseWriter.serialize(1212345671096543);
// hproseWriter.serialize(new Number(1212345671096543));
// hproseWriter.serialize(new Boolean(true));
// hproseWriter.serialize(true);
// hproseWriter.serialize(false);
// hproseWriter.serialize("hello world");
// hproseWriter.serialize("我");
// hproseWriter.serialize("");
// hproseWriter.serialize(new String("字符串对象"));
// hproseWriter.write("hello world");
// hproseWriter.write("我");
// hproseWriter.write("");
// hproseWriter.serialize("hello world");
// let date = new Date();
// hproseWriter.serialize(date);
// hproseWriter.serialize(date);
// let now = new Date();
// hproseWriter.utc = true;
// hproseWriter.serialize(now);
// hproseWriter.serialize(now);
// hproseWriter.serialize(() => {});
// hproseWriter.serialize(async () => {});
// hproseWriter.serialize(function*() { yield 1; });
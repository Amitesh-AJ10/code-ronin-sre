/**
 * Static Python documentation (LSP-style) for non-library skills: OOPS, CP, Cryptograph.
 * Use these to design realistic bugs when no single library doc site exists.
 */

/** OOPS: Python language & stdlib — classes, inheritance, builtins. */
export const pythonOopsDoc = `
Python OOP (language reference style):

Classes & instances:
- class C: pass creates a class; x = C() creates an instance. __init__(self, ...) is the constructor.
- self is explicit; first parameter of instance methods must be self (by convention).
- super() in a subclass calls the parent's method; super().__init__() must be called when overriding __init__.
- Class attributes vs instance: assigning to self.x creates/updates instance attr; C.x is class attr shared by all instances.

Common bugs (use for sabotage):
- Forgetting self in method def: def foo(x): instead of def foo(self, x): — TypeError when called as instance method.
- Mutable default argument: def f(self, x=[]): mutates shared list; use def f(self, x=None): x = x or [].
- Forgetting to call super().__init__() in subclass — parent state not initialized, AttributeError on parent attrs.
- Assigning to class attr by mistake: using self.class_attr = v when meaning to set instance — can confuse shared state.
- isinstance(obj, Class) and type(obj) == Class — latter fails for subclasses; prefer isinstance.
- __str__ vs __repr__: __str__ for print(), __repr__ for repr(); missing __repr__ falls back to default.
`.trim();

/** CP: Builtins, indexing, division, edge cases. */
export const pythonCpDoc = `
Python builtins & semantics (for competitive programming):

Numbers & division:
- / is true division (float); // is floor division (int when both ints). -7 // 2 == -4 (floor), 7 // 2 == 3.
- range(n) is 0..n-1; range(a, b) is a..b-1. range(0, n) has n elements; off-by-one is common.
- int and float: 1 / 2 == 0.5; 1 // 2 == 0. Indexing is 0-based; last element is arr[len(arr)-1] or arr[-1].

Indexing & slicing:
- s[i:j] is from i inclusive to j exclusive. s[:n] is first n, s[-n:] is last n. s[::-1] reverses.
- Negative index: -1 is last, -2 is second-to-last. Index out of range raises IndexError.
- list.append(x) in place; list + [x] returns new list. Modifying list while iterating can skip or repeat.

Edge cases (use for sabotage):
- Empty: [] and "" are falsy; check len(x) == 0 or not x. not [] is True.
- Division by zero: 1/0 raises ZeroDivisionError. Check denominator before dividing.
- Integer overflow: Python ints are arbitrary precision; but float has precision limits.
- range(n) in loop: loop variable persists after loop; late-binding in closures captures last value.
- == vs is: == value equality, is identity. Use is only for None, True, False; use == for numbers/strings.
`.trim();

/** Cryptography: stdlib hashlib, secrets, common pitfalls. */
export const pythonCryptoDoc = `
Python cryptography (stdlib — hashlib, secrets):

hashlib:
- hashlib.sha256(bytes).hexdigest() returns hex string; .digest() returns raw bytes. Must encode strings: .encode('utf-8').
- MD5/SHA1 are weak for security; use SHA-256 or SHA-3. hashlib.sha256() not hashlib.sha256 (missing call).
- Update then digest: h = hashlib.sha256(); h.update(b'part1'); h.update(b'part2'); h.hexdigest().

secrets (Python 3.6+):
- secrets.token_bytes(n), secrets.token_hex(n), secrets.token_urlsafe(n). Use for keys, tokens, salts.
- secrets.compare_digest(a, b) for constant-time comparison; == leaks timing. Use for HMAC/compare.

Common bugs (use for sabotage):
- Forgetting .encode() before hashing a str — TypeError: Unicode-objects must be encoded before hashing.
- Reusing IV/nonce for stream cipher or CBC — breaks security. Generate new IV per encryption.
- Short or predictable key — use secrets.token_bytes(32) for AES-256.
- Comparing digests with == instead of secrets.compare_digest — timing side-channel.
- Integer to bytes: (n).to_bytes(length, 'big') — wrong length or endianness corrupts value.
`.trim();

export const pythonDocsBySkill: Record<string, string> = {
    oops: pythonOopsDoc,
    cp: pythonCpDoc,
    cryptography: pythonCryptoDoc,
};

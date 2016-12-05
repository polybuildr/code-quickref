# C++ Standard Library Quickref

In case of any mistakes below, please please [file an issue on the GitHub repo](https://github.com/polybuildr/code-quickref/issues/new).

## Contents

- Containers
    - [Common Stuff](#common-stuff)
    - [Vector](#vector)
    - [Pair](#pair)
    - [Map](#map)
    - [Set](#set)
    - [Stack](#stack)
    - [Queue](#queue)
    - [Deque](#deque)
    - [Priority Queue](#priority-queue)
- Algorithms
    - [Sort](#sort)
    - [Binary Search](#binary-search)
- [Strings](#strings)

## Common Stuff

### auto

Since C++11, types can be inferred using <code class="language-cpp">auto</code>.

```cpp
// instead of
int x = 5;
// can use
auto x = 5;

// This is more useful in cases like:
map<char,int>::iterator it = mymap.begin();
// vs
auto it = mymap.begin(); // type inferred
```

### .size()

All containers support a <code class="language-cpp">.size()</code> that reports the number of elements in the container.

```cpp
vector<int> v = {1, 2, 3, 4};
v.size(); // = 4

map<int, int> mp;
mp[2] = 4;
mp[3] = 9;
mp.size(); // = 2

// etc.
```

### .empty()

All containers support a <code class="language-cpp">.empty()</code> that reports whether they are empty or not.

```cpp
vector<int> v;
v.push_back(10);
v.empty(); // = false

vector<int> v2;
v2.empty(); // true

map<int, int> mp;
mp[2] = 4;
mp.empty(); // = false

map<int, int> mp;
mp.empty(); // = true

// etc.
```

### bits/stdc++.h

When **not writing production code**, instead of including all the respective header files required, just the <code class="language-cpp">&lt;bits/stdc++.h&gt;</code> header file can be included. (Might not work on Macs.)

```cpp
#include <bits/stdc++.h>
```
<small class="to-top">[▲ back to top](#contents)</small>

## Vector

```cpp
#include <vector>

// initialization
vector<int> vec;

vector<int> vec2 = {1, 2, 3, 4}; // C++11

// insertion
vec.push_back(42);
vec.push_back(7);

// access
vec[0]; // = 42

// iteration
for (int i = 0; i < vec.size(); ++i) {
    vec[i]; // = 42, 7
}

// C++11 style iteration
for (int x: vec) {
    x; // = 42, 7
}
```
<small class="to-top">[▲ back to top](#contents)</small>

## Pair

Pairs are containers with two elements.

```cpp
#include <utility>

pair<int, int> p(5, 10);
p.first; // 5
p.second; // 10

p.first = 10;
p.first; // 10

// another way to initialize in C++11
auto p2 = make_pair(5, 10); // types are inferred
```
<small class="to-top">[▲ back to top](#contents)</small>

## Map

C++11 has two kinds of maps: <code class="language-cpp">map</code> (logarithmic time operations)and <code class="language-cpp">unordered_map</code> (average constant time operations).

Note: <code class="language-cpp">unordered_map</code>s cannot have keys that can't be hashed. For example, a <code class="language-cpp">pair&lt;int, int&gt;</code> as the key will not work. They can still be used in normal maps, though.

```cpp
#include <map>

// initialization

// O (log n) insert, access, delete
map<int, int> mp;

// O (1) insert, access, delete
// same signatures as normal map<>
unordered_map<int, int> omp;

// map<> keys are sorted in ascending order
// you can choose descending order:
map<int, int, std::greater<int> > mp2;
// #include <functional> for std::greater
// default is std::less<int>

// insertion
mp[2] = 4;
mp[3] = 9;

// access
mp[2]; // = 4

// check for existence
mp.find(2) != mp.end(); // true
mp.find(234) != mp.end(); // false
mp.count(2); // = 1
mp.count(234); // = 0

// deletion
mp.erase(2) // removes {2: 4}

// iteration
for (auto it = mp.begin(); it != mp.end(); ++it) {
    // iterator is a pair of (key, value)
    it->first; // key
    it->second; // value
}

// C++11 style iteration
for (auto kv: mp) {
    // to avoid making copies, use:
    // (auto &kv: mp)

    mp.first; // key
    mp.second; // value
}

```
<small class="to-top">[▲ back to top](#contents)</small>

## Set

C++11 has two kinds of sets: <code class="language-cpp">set</code> (logarithmic time operations) and <code class="language-cpp">unordered_set</code> (average constant time operations).

```cpp
#include <set>

set<int> st;

// insertion
st.insert(42);
st.insert(7);

// check existence
st.find(42) != st.end(); // true
st.find(234) != st.end(); // false
st.count(42); // = 1
st.count(234); // = 0

// iteration
for (auto it = st.begin(); it != st.end(); ++it) {
    *it; // = 7, 42
}

// C++ 11 style iteration
for (int x: st) {
    x; // = 7, 42
}

// deletion
st.erase(7); // removes 7
```
<small class="to-top">[▲ back to top](#contents)</small>

## Stack

Stacks are LIFO (last in first out) containers.

```cpp
#include <stack>

// initialization
stack<int> stk;

// insertion
stk.push(42);

// access
stk.top(); // = 42

// size
stk.size(); // = 1

// deletion
stk.pop(); // removes 42

// size
stk.size(); // = 0
```
<small class="to-top">[▲ back to top](#contents)</small>

## Queue

A FIFO (first in first out) container.

```cpp
#include <queue>

// initialization
queue<int> q;

// insertion
q.push(42);
q.push(7);
q.push(0);

// access
q.front(); // = 42
q.back(); // = 0

// front -> [42, 7, 0] <- back

// size
q.size(); // = 3

// deletion
q.pop(); // removes 42

q.front(); // = 7

q.pop(); // removes 7

// size
q.size(); // = 1
```
<small class="to-top">[▲ back to top](#contents)</small>

## Deque

A double-ended queue.

```cpp
#include <deque>

deque<int> dq;

// insertion
dq.push_back(3);
dq.push_back(4);
dq.push_front(2);
dq.push_front(1);

// front -> [1, 2, 3, 4] <- back

// access
dq.front(); // = 1
dq.back(); // = 4

// iteration
// can also iterate using [] operator
for (int i = 0; i < dq.size(); ++i) {
    dq[i]; // = 1, 2, 3, 4
}

// deletion
dq.pop_front(); // removes 1
dq.pop_back(); // removes 4
```
<small class="to-top">[▲ back to top](#contents)</small>

## Priority Queue

Priority queues are essentially heaps.

```cpp
#include <queue>

// initialization
priority_queue<int> pq; // max-heap
priority_queue<int, vector<int>, greater<int> > min_pq; // min-heap

// insertion
pq.push(7);
pq.push(42);

// access
pq.top(); // = 42, because max-heap

// delete
pq.pop(); // removes 42

pq.top(); // = 7
```
<small class="to-top">[▲ back to top](#contents)</small>

## Sort

```cpp
#include <algorithm>
// ^ for sort
#include <functional>
// ^ for greater<>

vector<int> vec;

// ascending order
sort(vec.begin(), vec.end());

// descending order
sort(vec.begin(), vec.end(), std::greater<int>());
```
<small class="to-top">[▲ back to top](#contents)</small>

## Binary search

Binary search assumes that the vector you give it is sorted. If not sorted, you will need to sort it first.

```cpp
#include <vector>
#include <algorithm>

vector<int> v = {1, 2, 4, 4, 6, 10}; // C++11 style

binary_search(v.begin(), v.end(), 4); // = true
binary_search(v.begin(), v.end(), 42); // = false
```

### lower and upper bound

Lower bound returns an iterator pointing to the first element which is **not less than** the given element.

```cpp
#include <vector>
#include <algorithm>

vector<int> v = {1, 2, 2, 5};

// returns iterator to first 2
auto it = lower_bound(v.begin(), v.end(), 2);
it - v.begin(); // = 1, since index is 1

// returns iterator to 5
auto it2 = lower_bound(v.begin(), v.end(), 3);
it2 - v.begin(); // = 3

// returns end iterator if nothing found
lower_bound(v.begin(), v.end(), 100) == v.end(); // true
```

Upper bound returns an iterator pointing to the first element which is **greater than** the given element.

```cpp
#include <vector>
#include <algorithm>

vector<int> v = {1, 2, 2, 5};

// returns iterator to 5
auto it = upper_bound(v.begin(), v.end(), 2);
it - v.begin(); // = 3, since index is 3

// also returns iterator to 5
auto it2 = upper_bound(v.begin(), v.end(), 3);
it2 - v.begin(); // = 3

// returns end iterator if nothing found
upper_bound(v.begin(), v.end(), 100) == v.end(); // true
```
<small class="to-top">[▲ back to top](#contents)</small>

## Strings

```cpp
#include <string>

// initialization
string s;
// equivalent to string s = "";

// concatenation
string s2 = "wor" + "ld";

// appending (many versions available)
s += 'H'; // char
s += "ello"; // C-string
s += s2; // C++ string
// s = "Helloworld"

// inserting at a position (many versions available)
s.insert(5, "@@");
// s = "Hello@@world"

// erasing (many versions available)
s.erase(5, 2); // delete 2 chars from pos 5
// s = "Helloworld"

// substring
string part = s.substr(1, 4); // from pos 1, 4 chars
// part = "ello"
```
<small class="to-top">[▲ back to top](#contents)</small>

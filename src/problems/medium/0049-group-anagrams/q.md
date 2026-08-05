# 49. Group Anagrams

https://leetcode.com/problems/group-anagrams/

Given an array of strings `strs`, group the anagrams together. You can return the answer in **any order**.

**Example 1:**

<pre>
<strong>Input:</strong> strs = ["eat","tea","tan","ate","nat","bat"]
<strong>Output:</strong> [["bat"],["nat","tan"],["ate","eat","tea"]]
<strong>Explanation:</strong>
</pre>

**Example 2:**

<pre>
<strong>Input:</strong> strs = [""]
<strong>Output:</strong> [[""]]
</pre>

**Example 3:**

<pre>
<strong>Input:</strong> strs = ["a"]
<strong>Output:</strong> [["a"]]
</pre>

**Constraints:**

* `1 <= strs.length <= 10<sup>4</sup>`
* `0 <= strs[i].length <= 100`
* `strs[i]` consists of lowercase English letters.

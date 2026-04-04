import React, { useEffect, useRef } from 'react';

export default function TimelinePage() {
  const ref = useRef();

  useEffect(() => {
    const weeks = [
      {label:"Week 1 — Apr 4–10",color:"#E6F1FB",accent:"#185FA5",badge:"Basics + Arrays",days:[
        {d:"Apr 4 (Fri)",t:"Basics: Even/odd, last digit, count digits, reverse number, power",a:"Time & Distance"},
        {d:"Apr 5 (Sat)",t:"Basics: GCD, divisors, prime, Armstrong, palindrome number, perfect num",a:"Time & Work"},
        {d:"Apr 6 (Sun)",t:"REST DAY — light review of week's topics",a:"—",rest:true},
        {d:"Apr 7 (Mon)",t:"Arrays: Max/min, 3rd largest, search, missing number",a:"Simple Interest"},
        {d:"Apr 8 (Tue)",t:"Arrays: Repeating num, sort 0s 1s 2s, equal arrays, rotate by 1",a:"Compound Interest"},
        {d:"Apr 9 (Wed)",t:"Arrays: Rotate by k, subset, frequency count, pair with sum",a:"Profit & Loss"},
        {d:"Apr 10 (Thu)",t:"Arrays: 3Sum, 4Sum, triplet zero sum, union/intersection, remove duplicates",a:"Percentage"},
      ]},
      {label:"Week 2 — Apr 11–17",color:"#EAF3DE",accent:"#3B6D11",badge:"Arrays Adv + 2D Array",days:[
        {d:"Apr 11 (Fri)",t:"Arrays: kth element of 2 sorted, longest subarray sum k, trapping rain",a:"Partnership"},
        {d:"Apr 12 (Sat)",t:"Arrays: Majority element, Kadane's, count inversions, merge intervals",a:"Problems on Ages"},
        {d:"Apr 13 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"Apr 14 (Mon)",t:"Arrays: Max product subarray, next permutation, Sieve of Eratosthenes",a:"Average"},
        {d:"Apr 15 (Tue)",t:"2D Array: What is matrix, search in matrix, rotate 90°, max 1s row",a:"Calendar"},
        {d:"Apr 16 (Wed)",t:"2D Array: Left rotate k times, diagonal pattern, set matrix zeros",a:"Clock"},
        {d:"Apr 17 (Thu)",t:"Recursion: Basics, print 1 to N, factorial, Fibonacci, power(x,n)",a:"Ratio & Proportion"},
      ]},
      {label:"Week 3 — Apr 18–24",color:"#FAEEDA",accent:"#854F0B",badge:"Recursion + Binary Search",days:[
        {d:"Apr 18 (Fri)",t:"Recursion: Print pattern, atoi, Pascal triangle",a:"Area"},
        {d:"Apr 19 (Sat)",t:"Binary Search: Sorted array search, floor/ceil, first & last occurrence",a:"Volume & Surface Area"},
        {d:"Apr 20 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"Apr 21 (Mon)",t:"Binary Search: Missing num, square root, search infinite array",a:"Chain Rule"},
        {d:"Apr 22 (Tue)",t:"Binary Search: Rotated sorted (with/without dups), minimum in rotated",a:"Problems on Numbers"},
        {d:"Apr 23 (Wed)",t:"Binary Search: Peak element, bitonic array, find row max 1s, search sorted matrix",a:"HCF & LCM"},
        {d:"Apr 24 (Thu)",t:"Binary Search Hard: Aggressive cows, allocate pages, painter partition, split array",a:"Decimal Fraction"},
      ]},
      {label:"Week 4 — Apr 25–May 1",color:"#FAECE7",accent:"#993C1D",badge:"BS Hard + Sorting + LL Basics",days:[
        {d:"Apr 25 (Fri)",t:"Binary Search: Bouquets, ship packages, Koko bananas, kth smallest",a:"Simplification"},
        {d:"Apr 26 (Sat)",t:"Binary Search: kth pair distance, ugly number II, median 2 sorted arrays",a:"Square & Cube Root"},
        {d:"Apr 27 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"Apr 28 (Mon)",t:"Sorting: Bubble, selection, insertion, merge sort, quick sort",a:"Surds & Indices"},
        {d:"Apr 29 (Tue)",t:"Linked List: Node representation, create/insert/delete, search, reverse",a:"Permutation & Combination"},
        {d:"Apr 30 (Wed)",t:"Linked List: Palindrome check, middle element, intersection, union & intersection",a:"Boats & Streams"},
        {d:"May 1 (Thu)",t:"Linked List: Delete without head, count pairs sum, reverse in groups, detect loop",a:"Pipes & Cistern"},
      ]},
      {label:"Week 5 — May 2–8",color:"#EEEDFE",accent:"#534AB7",badge:"LL Advanced + Stack",days:[
        {d:"May 2 (Fri)",t:"LL: Find loop length, starting point, remove loop, sort 0s1s2s, pairwise swap",a:"Alligation & Mixture"},
        {d:"May 3 (Sat)",t:"LL: Merge k sorted, merge sort LL, quick sort LL, remove duplicates sorted/unsorted",a:"Logarithm"},
        {d:"May 4 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"May 5 (Mon)",t:"LL: Segregate even/odd, add 1 to LL, add 2 numbers LL, rotate, flatten",a:"Races & Games"},
        {d:"May 6 (Tue)",t:"LL: Delete greater right, delete N after M, clone LL, DLL operations, pairs DLL",a:"Stocks & Shares"},
        {d:"May 7 (Wed)",t:"Stack: Basics, implement, 2-stack array, balanced parens, min in O(1)",a:"Probability"},
        {d:"May 8 (Thu)",t:"Stack: Next greater, next greater II, next smallest left/right, stock span",a:"True Discount"},
      ]},
      {label:"Week 6 — May 9–15",color:"#E1F5EE",accent:"#0F6E56",badge:"Stack Adv + Queue + Sliding Window",days:[
        {d:"May 9 (Fri)",t:"Stack: Trapping rain, max rect histogram, max rectangle, infix-postfix, eval postfix",a:"Banker's Discount"},
        {d:"May 10 (Sat)",t:"Stack: Reverse/sort stack, celebrity problem, candy crush, count reversals",a:"Odd Man Out & Series"},
        {d:"May 11 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"May 12 (Mon)",t:"Queue: Basics, implement, queue via LL, queue using stack, stack using queue",a:"Height & Distance"},
        {d:"May 13 (Tue)",t:"Queue: Reverse queue, circular tour, first non-repeating stream, reverse k, LRU cache",a:"Problems on Trains"},
        {d:"May 14 (Wed)",t:"Sliding Window Fixed: Max sum k, distinct elements window, first negative, max all subarrays",a:"Time & Distance"},
        {d:"May 15 (Thu)",t:"Sliding Window Variable: Subarray sum k, 0-sum, smallest distinct window, 0-1-2 window",a:"Simple Interest"},
      ]},
      {label:"Week 7 — May 16–22",color:"#E6F1FB",accent:"#185FA5",badge:"Trees Basics + BST",days:[
        {d:"May 16 (Fri)",t:"Sliding Window: Smallest window all chars, longest substring, 0s1s, anagram count, max consecutive",a:"Compound Interest"},
        {d:"May 17 (Sat)",t:"Trees: Basics, preorder, inorder, postorder, level order traversal",a:"Profit & Loss"},
        {d:"May 18 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"May 19 (Mon)",t:"Trees: Boundary, vertical, top/bottom view, left/right view, diagonal traversal",a:"Partnership"},
        {d:"May 20 (Tue)",t:"Trees: Height, diameter, identical trees, subtree check, balanced tree, LCA",a:"Percentage"},
        {d:"May 21 (Wed)",t:"Trees: Sum tree, symmetric, mirror, isomorphic, root-to-leaf paths, path sum",a:"Problems on Ages"},
        {d:"May 22 (Thu)",t:"Trees: Max path sum, K sum paths, nodes at distance, range sum BST, min distance",a:"Calendar"},
      ]},
      {label:"Week 8 — May 23–29",color:"#EAF3DE",accent:"#3B6D11",badge:"BST + Backtracking + Greedy",days:[
        {d:"May 23 (Fri)",t:"BST: Insert/search/min/max, kth largest/smallest, check BST, closest element, LCA BST, merge BST",a:"Clock"},
        {d:"May 24 (Sat)",t:"Backtracking: Permutations, combination sum I/II/III, rat in maze, subsets, N-queen",a:"Average"},
        {d:"May 25 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"May 26 (Mon)",t:"Backtracking: Parentheses, IP address, sudoku, kth permutation, word search, palindrome partition",a:"Area"},
        {d:"May 27 (Tue)",t:"Graphs: BFS, DFS, detect cycle directed/undirected, connected components, number of islands",a:"Ratio & Proportion"},
        {d:"May 28 (Wed)",t:"Graphs: Bipartite, shortest path UG/DAG, Dijkstra, word ladder, Floyd Warshall, Bellman Ford",a:"HCF & LCM"},
        {d:"May 29 (Thu)",t:"Graphs: Topological sort, course schedule, alien dictionary, MST, Kruskal, disjoint set",a:"Decimal Fraction"},
      ]},
      {label:"Week 9 — May 30–Jun 4",color:"#FBEAF0",accent:"#993556",badge:"DP + Heaps + Strings + Final Revision",days:[
        {d:"May 30 (Fri)",t:"Greedy: Activity selection, N meetings, min platforms, job sequencing, fractional knapsack",a:"Simplification"},
        {d:"May 31 (Sat)",t:"DP: 1D — stairs, house robber, coin change, LIS, LBS, edit distance",a:"Surds & Indices"},
        {d:"Jun 1 (Sun)",t:"REST DAY — light review",a:"—",rest:true},
        {d:"Jun 2 (Mon)",t:"DP: 2D grid, knapsack 0-1, subset sum, LCS, LPS, wildcard matching, buy/sell stocks",a:"Permutation & Combination"},
        {d:"Jun 3 (Tue)",t:"Heaps: Min/max heap, top-k, kth largest stream, merge k sorted, median stream",a:"Boats & Streams"},
        {d:"Jun 4 (Wed)",t:"Strings + Trie + FULL MOCK: KMP, Rabin-Karp, anagrams, trie basics + Full mock test + aptitude revision",a:"FULL APTITUDE REVISION"},
      ]},
    ];

    const container = ref.current;
    if (!container) return;

    weeks.forEach((w, wi) => {
      const block = document.createElement('div');
      block.style.cssText = 'margin-bottom:1.5rem;border:0.5px solid #e2e8f0;border-radius:12px;overflow:hidden';

      const hdr = document.createElement('div');
      hdr.style.cssText = `padding:12px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:${w.color}55`;
      hdr.innerHTML = `
        <div>
          <div style="font-size:14px;font-weight:600;color:#1a202c">${w.label}</div>
          <div style="height:4px;width:120px;background:#e2e8f0;border-radius:2px;margin-top:6px">
            <div style="height:100%;width:${Math.round((wi+1)/weeks.length*100)}%;background:${w.accent};border-radius:2px"></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:11px;padding:3px 8px;border-radius:6px;background:${w.color};color:${w.accent};font-weight:500">${w.badge}</span>
          <span id="chev${wi}" style="font-size:12px;transition:transform 0.2s;color:#718096">▼</span>
        </div>`;

      const body = document.createElement('div');
      body.id = 'body' + wi;
      body.style.display = 'none';

      const colH = document.createElement('div');
      colH.style.cssText = 'display:grid;grid-template-columns:100px 1fr 180px;background:#f7fafc;border-top:0.5px solid #e2e8f0';
      colH.innerHTML = ['Day','DSA / Coding problems','Aptitude (30 min)'].map(h =>
        `<div style="padding:6px 12px;font-size:11px;font-weight:600;color:#a0aec0;text-transform:uppercase;letter-spacing:0.5px">${h}</div>`
      ).join('');
      body.appendChild(colH);

      w.days.forEach(day => {
        const row = document.createElement('div');
row.style.cssText = `display:grid;grid-template-columns:100px 1fr 180px;border-top:0.5px solid #e2e8f0;background:${day.rest ? '#f1f5f9' : '#ffffff'}`;        row.innerHTML = `
          <div style="padding:8px 12px;font-size:12px;font-weight:500;color:#718096;border-right:0.5px solid #e2e8f0;display:flex;align-items:center;background:${day.rest?'#f7fafc':'#fafafa'}">${day.d}</div>
          <div style="padding:8px 12px;font-size:13px;color:${day.rest?'#a0aec0':'#2d3748'};display:flex;align-items:center;${day.rest?'font-style:italic':''}">${day.t}</div>
          <div style="padding:8px 12px;font-size:12px;color:#718096;border-left:0.5px solid #e2e8f0;display:flex;align-items:center;font-style:italic">${day.a}</div>`;
        body.appendChild(row);
      });

      hdr.addEventListener('click', () => {
        const isOpen = body.style.display === 'block';
        body.style.display = isOpen ? 'none' : 'block';
        const chev = document.getElementById('chev' + wi);
        if (chev) chev.style.transform = isOpen ? '' : 'rotate(180deg)';
      });

      block.appendChild(hdr);
      block.appendChild(body);
      container.appendChild(block);
    });

    // Open first week by default
    const firstBody = document.getElementById('body0');
    const firstChev = document.getElementById('chev0');
    if (firstBody) firstBody.style.display = 'block';
    if (firstChev) firstChev.style.transform = 'rotate(180deg)';
  }, []);

  return (
       <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto', background: '#ffffff', minHeight: '100vh', color: '#1a202c' }}>      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1a202c' }}>Placement Prep Timeline</h2>
        <p style={{ fontSize: 13, color: '#718096', marginTop: 4 }}>~5 problems/day on coding topics + 30 min aptitude daily. Click a week to expand.</p>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[['#378ADD','DSA / Coding'],['#1D9E75','Aptitude'],['#D85A30','Revision / Mock']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#718096' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>
      <div ref={ref} />
    </div>
  );
}

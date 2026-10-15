// 定版微基准：LLM 写 Rust 三个高频翻车点（本机 2 核 EPYC + rustc 1.99.0, -O）
// 口径：各 20 轮取中位；N 拉大 + black_box 防优化；每个翻车点配一个基线做「税」的比例。
use std::time::Instant;
use std::hint::black_box;

fn median(v:&mut [f64]) -> f64 { v.sort_by(|a,b| a.partial_cmp(b).unwrap()); v[v.len()/2] }
fn bench<F: Fn()>(iters:usize, f:&mut F) -> f64 {
    let mut v=Vec::new();
    for _ in 0..iters { let t=Instant::now(); f(); v.push(t.elapsed().as_secs_f64()*1e3); }
    median(&mut v)
}

fn main(){
    let I = 20usize;

    // [1] 热路径 format! 分配税：每轮堆临时 String vs 纯算术基线（同迭代数，不分配）
    let f1 = bench(I, &mut || {
        let mut acc=0u64;
        for _ in 0..2_000_000u64 { let s=format!("val={}", acc); acc+=s.len() as u64; }
        black_box(acc);
    });
    let f1b = bench(I, &mut || {
        let mut acc=0u64;
        for i in 0..2_000_000u64 { acc+= i; }          // 不分配的对照
        black_box(acc);
    });
    println!("[1] 热路径 format! x200万: {:.1} ms | 无分配对照 {:.1} ms | 分配税约 {:.0}x",
        f1, f1b, f1/f1b);

    // [2] clone vs 借用（10M u64 = 80MB），LLM 常把 &Vec 抄成 clone
    let v: Vec<u64> = (0..10_000_000u64).collect();
    let c2a = bench(I, &mut || { let s=v.iter().sum::<u64>(); black_box(s); });
    let c2b = bench(I, &mut || { let w=v.clone(); let s=w.iter().sum::<u64>(); black_box(s); });
    println!("[2a] 借用 sum(80MB): {:.1} ms", c2a);
    println!("[2b] clone 80MB 再 sum: {:.1} ms  (clone 单点税约 {:.1} ms)", c2b, c2b-c2a);

    // [3] 迭代器链 vs 手写循环（拆「链一定慢」的玄学）
    let m3a = bench(I, &mut || { let s=(0..20_000_000u64).filter(|x| x%2==0).map(|x| x+1).sum::<u64>(); black_box(s); });
    let m3b = bench(I, &mut || { let mut acc=0u64; for x in 0..20_000_000u64 { if x%2==0 { acc+=x+1; } } black_box(acc); });
    println!("[3a] 迭代器链 filter+map+sum: {:.1} ms", m3a);
    println!("[3b] 手写循环 同逻辑:         {:.1} ms  (-O 下链比手写{}{}%)",
        m3b, if m3a>=m3b {"慢 "} else {"快 "}, ((m3a-m3b).abs()/m3b*100.0));
}

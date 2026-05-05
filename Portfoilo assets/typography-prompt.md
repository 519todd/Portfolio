# Typography System — Claude Code Prompt

請將以下 Typography 規格套用到整個專案。
完成後告訴我你修改了哪些檔案。

---

## 字體

```css
font-family: -apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif;
```

---

## Step 1 — 在 globals.css（或 index.css）建立 CSS Variables

```css
:root {
  /* Font family */
  --font: -apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif;

  /* Type scale (responsive) */
  --h1-size:   clamp(2.5rem, 6.5vw, 4.5rem);   /* 40px → 72px */
  --h2-size:   clamp(1.625rem, 3.2vw, 2.25rem); /* 26px → 36px */
  --h3-size:   clamp(1.0625rem, 1.8vw, 1.1875rem); /* 17px → 19px */
  --p-size:    1.0625rem;   /* 17px，固定 */
  --cap-size:  0.75rem;     /* 12px，固定 */

  /* Color tokens */
  --ink:       #1c1c1e;
  --ink-55:    #636366;
  --ink-30:    #aeaeb2;
  --ink-12:    #e5e5ea;
  --bg-fill:   #f2f2f7;
  --accent:    #4E008E;
}
```

---

## Step 2 — 套用 Typography 規格到所有 h1 / h2 / h3 / p / .caption

```css
body {
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
}

h1 {
  font-size: var(--h1-size);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--ink);
}

h2 {
  font-size: var(--h2-size);
  font-weight: 600;
  line-height: 1.20;
  letter-spacing: -0.022em;
  color: var(--ink);
}

h3 {
  font-size: var(--h3-size);
  font-weight: 500;
  line-height: 1.40;
  letter-spacing: -0.01em;
  color: var(--ink);
}

p {
  font-size: var(--p-size);
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: -0.005em;
  color: var(--ink-55);
}

.caption {
  font-size: var(--cap-size);
  font-weight: 500;
  line-height: 1.50;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-30);
}
```

---

## Step 3 — 清理規則

- 把所有 inline 的 font-size、font-weight、color、letter-spacing、line-height **全部移除**，改用上面的 CSS variables 或 class
- 不要留舊的值，也不要新舊並存
- 如果專案有 Tailwind，請在 `tailwind.config` 的 `theme.extend` 同步加入這些 token，例如：

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      ink:      '#1c1c1e',
      'ink-55': '#636366',
      'ink-30': '#aeaeb2',
      'ink-12': '#e5e5ea',
      'bg-fill':'#f2f2f7',
      accent:   '#4E008E',
    },
    fontFamily: {
      sans: ['-apple-system', 'SF Pro Display', 'BlinkMacSystemFont', 'sans-serif'],
    },
  }
}
```

---

## 規格速查表

| 層級       | 字重          | 大小（responsive）  | 行高  | 字距      | 顏色      |
|------------|---------------|---------------------|-------|-----------|-----------|
| H1         | 700 Bold      | 40px → 72px         | 1.06  | −0.030em  | #1c1c1e   |
| H2         | 600 Semibold  | 26px → 36px         | 1.20  | −0.022em  | #1c1c1e   |
| H3         | 500 Medium    | 17px → 19px         | 1.40  | −0.010em  | #1c1c1e   |
| P 正文     | 400 Regular   | 17px（固定）        | 1.75  | −0.005em  | #636366   |
| .caption   | 500 Medium    | 12px（固定）        | 1.50  | +0.100em  | #aeaeb2   |

| Token    | Hex     | 用途               |
|----------|---------|--------------------|
| ink      | #1c1c1e | 標題、主體文字     |
| ink-55   | #636366 | 正文               |
| ink-30   | #aeaeb2 | 說明文字、placeholder |
| ink-12   | #e5e5ea | 分隔線、border     |
| bg-fill  | #f2f2f7 | 卡片背景、區塊背景 |
| accent   | #4E008E | 重點色、CTA、link  |

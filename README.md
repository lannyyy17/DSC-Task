# FlopOrNot 📈

A rule-based AI prediction engine that utilizes `pandas` for data handling and `matplotlib` for dynamic visualization. This project predicts an Instagram account's post engagement tier (High or Low) by evaluating dynamic feature inputs.

## 🧠 Explanation of Logic
The predictor utilizes a custom, rule-based **Scoring System** using nested `if-else` operators driven by patterns established in our mock dataset (`instagram_dataset.csv`):
- **For Reels:** It calculates a base score out of 6 points. Points are sequentially awarded if the Reel is short (`≤ 15s`), posted during peak evening hours (`17:00 - 22:00`), uses optimal tags (`3 - 8`), and lands in high-reach genres (`Entertainment`). Crucially, a massive +3 score boost is provided if it utilizes a **Trending Audio/Topic**, emulating modern TikTok/IG algorithmic preferences. Scores >=5 map to 🔥 "Viral Potential/High", while mid-scores give "Solid Engagement".
- **For Carousels/Images:** Logic is strictly time and tag-based. Carousels excel in afternoon windows (`12:00 - 16:00`), while static single Images trigger default low-reach expectations to accurately reflect current algorithmic priorities.

## 🚀 Two Options Included

### 1. The Python Script (`instagram_predictor.py`)
This is the core implementation strictly in Python. It handles dataframe generation, exports the dataset to CSV, dynamically renders 3 `matplotlib` analytical charts, and runs an infinite Terminal UI loop for real-time user inputs.
**Instructions to run:**
1. Clone this repository.
2. Install the listed data dependencies natively across your environment: 
   ```bash
   pip install -r requirements.txt
   ```
3. Run the engine:
   ```bash
   python instagram_predictor.py
   ```

### 2. The Browser Web App (`/web_predictor` directory) [BONUS UI APP]
A frictionless, beautifully-styled interface translating our `if-else` rules purely into Client-Side HTML/CSS/JS! No Python installs or backend server needed.
**Instructions to run:**
- Simply locate the repository in your file explorer and double-click `web_predictor/index.html` to open the sleek web predictor. Use the custom sliders and dropdowns to test real-time predictions.

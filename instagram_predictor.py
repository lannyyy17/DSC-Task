import pandas as pd
import matplotlib.pyplot as plt

def main():
    # 1. Create an enhanced dataset with our new features
    # We simulate an Instagram account that posts Reels, Images, Carousels with advanced features.
    data = {
        'post_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        'content_type': ['Reel', 'Image', 'Carousel', 'Reel', 'Image', 'Reel', 'Carousel', 'Reel', 'Image', 'Carousel', 'Reel', 'Reel'],
        'posting_hour': [18, 10, 14, 20, 9, 19, 15, 21, 11, 13, 19, 20],
        'hashtag_count': [5, 12, 8, 4, 15, 6, 10, 3, 20, 7, 6, 5],
        'duration_seconds': [15, 0, 0, 12, 0, 60, 0, 10, 0, 0, 14, 15],
        'genre': ['entertainment', 'none', 'none', 'education', 'none', 'lifestyle', 'none', 'entertainment', 'none', 'none', 'entertainment', 'fitness'],
        'is_trending': [True, False, False, False, False, False, False, True, False, False, True, False],
        'engagement': ['High', 'Low', 'Low', 'High', 'Low', 'Low', 'High', 'High', 'Low', 'High', 'High', 'Low']
    }

    df = pd.DataFrame(data)
    df.to_csv('instagram_dataset.csv', index=False)
    print("=== Training Dataset (Exported to instagram_dataset.csv) ===")
    print(df.to_string(index=False))
    print("========================\n")

    # 2. Visualization
    print("Generating Engagement Visualization... (Close the plot window if it blocks input)")
    fig, axes = plt.subplots(1, 3, figsize=(16, 5))
    
    # Plot 1: Engagement by Content Type
    engagement_counts = df.groupby(['content_type', 'engagement']).size().unstack(fill_value=0)
    for col in ['High', 'Low']:
        if col not in engagement_counts.columns:
            engagement_counts[col] = 0
    engagement_counts = engagement_counts[['High', 'Low']]
    engagement_counts.plot(kind='bar', stacked=True, color=['#2ca02c', '#d62728'], ax=axes[0])
    axes[0].set_title('Engagement by Content Type')
    axes[0].set_ylabel('Number of Posts')
    axes[0].set_xticklabels(axes[0].get_xticklabels(), rotation=0)

    # Plot 2: Posting Hour vs Hashtag Count
    colors = df['engagement'].map({'High': '#2ca02c', 'Low': '#d62728'})
    axes[1].scatter(df['posting_hour'], df['hashtag_count'], c=colors, s=100, alpha=0.7)
    axes[1].set_xlabel('Posting Hour (0-23)')
    axes[1].set_ylabel('Hashtag Count')
    axes[1].set_title('Posting Hour vs Hashtags\n(Green: High, Red: Low)')
    
    # Plot 3: Reels - Trending Audio Impact
    reels_df = df[df['content_type'] == 'Reel']
    trending_counts = reels_df.groupby(['is_trending', 'engagement']).size().unstack(fill_value=0)
    for col in ['High', 'Low']:
        if col not in trending_counts.columns:
            trending_counts[col] = 0
    trending_counts = trending_counts[['High', 'Low']]
    trending_counts.plot(kind='bar', stacked=True, color=['#2ca02c', '#d62728'], ax=axes[2])
    axes[2].set_title('Reels: Impact of Trending Audio')
    axes[2].set_xlabel('Is Trending')
    axes[2].set_xticklabels(['No', 'Yes'], rotation=0)

    plt.tight_layout()
    plt.show(block=False)
    
    # 3. Rule-based Classifier via if-else statements (Using advanced weighted logic)
    def predict_engagement(content_type, posting_hour, hashtag_count, duration, genre='', is_trending=False):
        ctype = content_type.lower().strip()
        
        if ctype == 'reel':
            # Utilizing a weighted baseline to evaluate comprehensive features
            base_score = 0
            if duration <= 15: base_score += 2
            if 17 <= posting_hour <= 22: base_score += 1
            if 3 <= hashtag_count <= 8: base_score += 1
            if is_trending: base_score += 3
            if genre.lower().strip() == 'entertainment': base_score += 1
            
            if base_score >= 5:
                title = "Viral Potential! 🚀"
                desc = "Trending audio + optimized settings is a recipe for massive reach." if is_trending else "Great optimization setup. Highly likely to hit high engagement!"
                return f"\n[🔥] {title}\n    -> {desc}"
            elif base_score >= 3:
                title = "Solid Engagement ✨"
                desc = "Good metrics! Try finding a trending audio to push it to the explore page."
                return f"\n[📈] {title}\n    -> {desc}"
            else:
                title = "Low Engagement 📉"
                desc = "To boost this reel, use a trending audio, shorten duration (<= 15s), and post from 17:00-22:00."
                return f"\n[🧊] {title}\n    -> {desc}"
                
        elif ctype == 'carousel':
            if 12 <= posting_hour <= 16 and 5 <= hashtag_count <= 10:
                return "\n[✨] Solid Engagement! \n    -> Afternoon carousels with 5-10 hashtags do well."
            else:
                return "\n[📉] Low Engagement \n    -> Try posting in the afternoon with 5-10 hashtags."
                
        elif ctype == 'image':
            return "\n[📉] Limited Reach \n    -> Images are out of algorithmic favor compared to Reels."
            
        else:
            return "\n[?] Unknown Content Type"

    # 4. Interactive User Input Prompt
    print("\n" + "="*45)
    print("  📈 FLOP OR NOT - TERMINAL UI")
    print("="*45)
    
    while True:
        try:
            u_content = input("\nContent Type (Reel/Image/Carousel) or 'q' to quit: ")
            if u_content.lower() == 'q':
                print("Exiting predictor. Goodbye!")
                break
                
            u_hour = int(input("Posting Hour (0-23): "))
            u_hashtags = int(input("Number of hashtags: "))
            
            u_duration = 0
            u_genre = ''
            u_trending = False
            
            if u_content.lower().strip() == 'reel':
                u_duration = int(input("Reel duration in seconds: "))
                
                print("    > Popular Genres: entertainment, education, lifestyle, fitness")
                u_genre = input("Reel Genre: ").strip().lower()
                
                trend_input = input("Uses a Trending Audio or Topic? (y/n): ").strip().lower()
                u_trending = True if trend_input == 'y' else False
                
            pred = predict_engagement(u_content, u_hour, u_hashtags, u_duration, u_genre, u_trending)
            print(f"{pred}")
            print("-" * 45)
            
        except ValueError:
            print("\n[!] Invalid input: Please enter a valid number for hour, hashtags, and duration.")
        except KeyboardInterrupt:
            break
            
if __name__ == "__main__":
    main()

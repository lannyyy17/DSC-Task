document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictor-form');
    const radios = document.querySelectorAll('input[name="content_type"]');
    const reelOptionsGroup = document.getElementById('reel-options-group');
    const durationInput = document.getElementById('duration');
    const durationValText = document.getElementById('duration-val');
    const hourInput = document.getElementById('hour');
    const timeValText = document.getElementById('time-val');
    const hashtagsInput = document.getElementById('hashtags');
    const hashtagsValText = document.getElementById('hashtags-val');
    
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');

    // UI Updates based on slider and radio interactions
    durationInput.addEventListener('input', (e) => {
        durationValText.textContent = `${e.target.value}s`;
    });

    hourInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        const suffix = val >= 12 ? 'PM' : 'AM';
        let displayHour = val % 12;
        if (displayHour === 0) displayHour = 12;
        // Specifically for midnight, ensure it shows 12:00 AM
        timeValText.textContent = `${displayHour}:00 ${suffix}`;
    });

    hashtagsInput.addEventListener('input', (e) => {
        hashtagsValText.textContent = e.target.value;
    });

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'reel') {
                reelOptionsGroup.style.display = 'block';
                reelOptionsGroup.style.opacity = 0;
                setTimeout(() => reelOptionsGroup.style.opacity = 1, 50);
            } else {
                reelOptionsGroup.style.display = 'none';
            }
            
            // clear result when changing content type
            resultContainer.classList.add('hidden');
        });
    });

    // The logic engine computationally isolated to local Javascript.
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve form values
        const type = document.querySelector('input[name="content_type"]:checked').value;
        const hour = parseInt(document.getElementById('hour').value);
        const hashtags = parseInt(document.getElementById('hashtags').value);
        let duration = 0;
        let genre = '';
        let isTrending = false;

        if (type === 'reel') {
            duration = parseInt(document.getElementById('duration').value);
            genre = document.getElementById('genre').value;
            isTrending = document.getElementById('trending-topic').checked;
        }

        const prediction = evaluateEngagement(type, hour, hashtags, duration, genre, isTrending);
        showResult(prediction);
    });

    function evaluateEngagement(type, hour, hashtags, duration, genre, isTrending) {
        if (type === 'reel') {
            let baseScore = 0;
            if (duration <= 15) baseScore += 2;
            if (hour >= 17 && hour <= 22) baseScore += 1;
            if (hashtags >= 3 && hashtags <= 8) baseScore += 1;
            if (isTrending) baseScore += 3; // Huge bump for trending topics
            if (genre === 'entertainment') baseScore += 1; // Slight edge for entertainment/comedy

            if (baseScore >= 5) {
                return {
                    status: 'high',
                    title: 'Viral Potential! 🔥',
                    desc: isTrending ? 'Trending audio + optimized reel settings is a recipe for massive reach.' : 'Great optimization setup. Highly likely to hit high engagement explore pages.'
                };
            } else if (baseScore >= 3) {
                 return {
                    status: 'high',
                    title: 'Solid Engagement 🚀',
                    desc: 'Good metrics! Using trending audio and keeping it short (≤15s) generally pushes it higher.'
                };
            } else {
                return {
                    status: 'low',
                    title: 'Low Engagement 📉',
                    desc: 'To boost this reel, use a trending audio, shorten duration (≤15s), and post during evening peak hours (17:00-22:00).'
                };
            }
        } else if (type === 'carousel') {
            if (hour >= 12 && hour <= 16 && hashtags >= 5 && hashtags <= 10) {
                return {
                    status: 'high',
                    title: 'Solid Engagement! ✨',
                    desc: 'Afternoon carousels with moderate hashtags hit the sweet spot.'
                };
            } else {
                return {
                    status: 'low',
                    title: 'Low Engagement 📉',
                    desc: 'Carousels perform best when posted in the afternoon (12:00-16:00) with 5-10 targeted hashtags.'
                };
            }
        } else if (type === 'image') {
            return {
                status: 'low',
                title: 'Limited Reach 🖼️',
                desc: 'Static images tend to have lower organic engagement compared to reels or carousels.'
            };
        }
    }

    function showResult(prediction) {
        resultContainer.classList.remove('hidden');
        
        // Reset and re-trigger animation for the icon
        resultIcon.style.animation = 'none';
        void resultIcon.offsetWidth; // trigger layout reflow
        resultIcon.style.animation = 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        resultTitle.textContent = prediction.title;
        resultTitle.className = prediction.status === 'high' ? 'status-high' : 'status-low';
        resultDesc.textContent = prediction.desc;
        resultIcon.textContent = prediction.status === 'high' ? '🔥' : '🧊';
    }

    // --------------- CHART.JS VISUALIZATION ---------------
    // Simulated Dataset reproducing Python Pandas Output
    const mockData = [
        { type: 'Reel', hour: 18, tags: 5, status: 'High' },
        { type: 'Image', hour: 10, tags: 12, status: 'Low' },
        { type: 'Carousel', hour: 14, tags: 8, status: 'Low' },
        { type: 'Reel', hour: 20, tags: 4, status: 'High' },
        { type: 'Image', hour: 9, tags: 15, status: 'Low' },
        { type: 'Reel', hour: 19, tags: 6, status: 'Low' },
        { type: 'Carousel', hour: 15, tags: 10, status: 'High' },
        { type: 'Reel', hour: 21, tags: 3, status: 'High' },
        { type: 'Image', hour: 11, tags: 20, status: 'Low' },
        { type: 'Carousel', hour: 13, tags: 7, status: 'High' }
    ];

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Chart 1: Bar Chart
    const ctxType = document.getElementById('typeChart').getContext('2d');
    new Chart(ctxType, {
        type: 'bar',
        data: {
            labels: ['Reel', 'Carousel', 'Image'],
            datasets: [
                {
                    label: 'High Engagement',
                    data: [3, 2, 0], // computed from mockData
                    backgroundColor: '#10b981',
                    borderRadius: 4
                },
                {
                    label: 'Low Engagement',
                    data: [1, 1, 3], // computed from mockData
                    backgroundColor: '#ef4444',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Model Results by Content Type' }
            },
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true }
            }
        }
    });

    // Chart 2: Scatter Plot
    const highData = mockData.filter(d => d.status === 'High').map(d => ({ x: d.hour, y: d.tags }));
    const lowData = mockData.filter(d => d.status === 'Low').map(d => ({ x: d.hour, y: d.tags }));

    const ctxScatter = document.getElementById('scatterChart').getContext('2d');
    new Chart(ctxScatter, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'High Engagement',
                    data: highData,
                    backgroundColor: '#10b981',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Low Engagement',
                    data: lowData,
                    backgroundColor: '#ef4444',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Posting Hour vs Hashtags' }
            },
            scales: {
                x: { 
                    title: { display: true, text: 'Posting Hour (0-23)' },
                    min: 0,
                    max: 23
                },
                y: { 
                    title: { display: true, text: 'Hashtag Count' }, 
                    beginAtZero: true 
                }
            }
        }
    });
});

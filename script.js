document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Story Hover Interaction
    // ---------------------------------------------------------
    const storyItems = document.querySelectorAll('.story-item');

    storyItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Activate Text List Item
            storyItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Activate Visual Layer
            const stepIndex = item.dataset.step;
            updateStoryVisual(stepIndex);
        });
    });

    function updateStoryVisual(step) {
        const timeline = document.querySelector('.story-timeline');
        const timer = document.querySelector('.story-timer');
        const stats = document.querySelector('.story-stats');

        if (step === '1' || step === '2') {
            // Steps 1 & 2: Show Video (Timeline)
            // Only add class if not already active to prevent restart/flicker
            if (!timeline.classList.contains('active')) {
                timeline.classList.add('active');
            }
            timer.classList.remove('active');
            stats.classList.remove('active');
        } else if (step === '3') {
            // Step 3: Show Stats
            if (!stats.classList.contains('active')) {
                stats.classList.add('active');
            }
            timeline.classList.remove('active');
            timer.classList.remove('active');
        }
    }




    // ---------------------------------------------------------
    // 2. Interactive Details Logic (Hover Switch)
    // ---------------------------------------------------------
    const featureItems = document.querySelectorAll('.feature-item');
    const interactiveCard = document.querySelector('.detail-card.card-interactive');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');

    // Content Map
    const contentMap = {
        'ios': {
            title: 'Perfect iOS Integration',
            desc: 'Leverage all iPhone features<br>to track faster and easier.'
        },
        'calendar': {
            title: 'Calendar Sync',
            desc: 'Manage events and records<br>in one place.'
        },
        'custom': {
            title: 'Timer Customization',
            desc: 'Personalize your timer<br>with your own style.'
        },
        'noise': {
            title: '8 White Noise Sounds',
            desc: 'Various sounds<br>to boost your focus.'
        },
        'pdf': {
            title: 'PDF Export',
            desc: 'Save your records<br>as clean reports.'
        },
        'dark': {
            title: 'Dark Mode',
            desc: 'Eye-friendly dark mode<br>for nighttime use.'
        }
    };

    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const targetKey = item.dataset.target;

            // Highlight list item
            featureItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Switch Image
            activateVisual(targetKey);

            // Update Text
            if (contentMap[targetKey]) {
                // Fade text out slightly for transition effect (optional, simplified here)
                detailTitle.textContent = contentMap[targetKey].title;
                detailDesc.innerHTML = contentMap[targetKey].desc;
            }

            // Special Case: Dark Mode Background
            if (targetKey === 'dark') {
                interactiveCard.classList.add('dark-theme');
            } else {
                interactiveCard.classList.remove('dark-theme');
            }

            // Remove all background color classes first
            interactiveCard.classList.remove('bg-pdf', 'bg-noise', 'bg-custom', 'bg-calendar');

            // Add specific background color based on feature
            if (targetKey === 'pdf') {
                interactiveCard.classList.add('bg-pdf');
            } else if (targetKey === 'noise') {
                interactiveCard.classList.add('bg-noise');
            } else if (targetKey === 'custom') {
                interactiveCard.classList.add('bg-custom');
            } else if (targetKey === 'calendar') {
                interactiveCard.classList.add('bg-calendar');
            }
        });
    });

    function activateVisual(key) {
        // Hide all visuals
        document.querySelectorAll('.interactive-img, .interactive-custom').forEach(el => {
            el.classList.remove('active');
        });

        // Show target visual
        const target = document.querySelector(`.interactive-img[data-key="${key}"]`) ||
            document.querySelector(`.interactive-custom[data-key="${key}"]`);

        if (target) {
            target.classList.add('active');
        }
    }
});

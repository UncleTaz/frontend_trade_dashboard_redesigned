import { useState, useEffect } from 'react';

export interface ContentItem {
  type: 'paragraph' | 'code' | 'diagram' | 'link';
  text?: string;
  code?: string;
  language?: string;
  src?: string;
  url?: string;
}

export interface InformationSection {
  id: string;
  title: string;
  content: ContentItem[];
}

interface InformationSectionsState {
  sections: InformationSection[];
  isLoading: boolean;
}

const CACHE_KEY = 'information_sections_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useInformationSections = () => {
  const [state, setState] = useState<InformationSectionsState>({
    sections: [],
    isLoading: true
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { sections, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setState({ sections, isLoading: false });
            return;
          }
        }

        // If no cache or expired, load content
        const sections: InformationSection[] = [
          {
            id: 'about',
            title: 'Background',
            content: [
              { type: 'paragraph', text: "Welcome to the live dashboard for my automated trading bot testing and optimization!" },
              { type: 'paragraph', text: "My background is in Engineering and Strategy Consulting, and I started to get seriously involved in the markets in mid-2022. I traded my first NQ futures contract in Dec 2023 after dabbling a little with MES and MNQ, and SPX options for a while. From the beginning of my trading journey, I wanted to apply the same rigour and analysis which had served me well in my previous careers, to try and discover some robust and systematic trading strategies which could beat a more manual intuitive approach. I spent 18 months testing various strategies manually with mixed success, encountering the common boom and bust of early career traders." },
              { type: 'paragraph', text: "Then, in the summer of 2024, I reached a significant inflection point with NQ scalping. This wasn't about any major holy-grail strategy discovery, but rather sticking to a setup I'd seen worked well in many market conditions, and trying my best to have confidence in the setup, executing without fear or FOMO, and with consistent risk i.e. a hard stop loss. I had my first >$10k net P&L month soon after and my equity curve started heading up and to the right with a decent gradient! This continued for some months, but then during the market volatility resulting from the Trump tariff announcements, I struggled to maintain discipline with my risk management, and so I decided to take a step back and re-assess the next phase of my trading path." },
              { type: 'paragraph', text: "Motivated, since I was convinced of my strategies' potential, proven through rigorous back-testing and live discretionary trading, in the spring of 2025 I committed to take my trading to the next level, which meant 1) becoming systematic-first in all aspects 2) building the necessary software dev knowledge and infrastructure to automate, test, and go live with my strategies, whilst mitigating as much risk as possible. And so was born my 1-man algorithmic trading start-up. This dashboard forms a small part of the infrastructure I'm putting in place to manage the end-to-end workflow." },
              { type: 'paragraph', text: "As of June 2025, I'm currently running three experimental configurations of an automated NQ futures scalping trading bot built in Sierra Chart using ACSIL (C++). The bot is designed to identify high-probability long-only mean-reversion opportunities in the sub 1-minute timeframe and execute trades with precision under varying conditions. As the name implies, it seeks to scalp small wins on a high frequency basis (roughly 100 - 150 trades per 24 hrs), aiming for a high win rate % to limit the drawdown from inevitable losses." },
              { type: 'paragraph', text: "The strategy evolved from trying to automate what I was intuiting when scalping manually, and took dozens of coding iterations, eventually incorporating Kalman filters for trend and volatility estimation, adaptive thresholding based on real-time market dynamics, and multi-layered gating logic to refine signal quality. One of the bot's core features is a flexible \"down move detection\" engine with configurable strictness settings—this acts as a trigger filter to isolate sharp downside impulses, often precursors to reversal setups. These thresholds are not static; they're scaled using adaptive volatility models to better reflect changing market regimes." },
              { type: 'paragraph', text: "The 3 configurations are currently only the OCO bracket order settings, representing 3 settings of trailing stop, with each bot taking an identical entry signal. There is also currently a fairly conservative TP on each configuration, which undoubtedly limits the profit upside. In addition, the signal engine settings being used are the most basic I could set. I have purposely dumbed down the bot and restricted upside to try and prove a level of robustness that would give me confidence that even with some potential additional slippage, the results would improve when the bot is further optimised in both signal settings and less restrictive/no TP. For info, the conservative bot was started on 4th June, and the steady, and agressive bots on 8th June. On 16th June, I discovered incorrect (too loose) limit chase order settings on the conservative and steady bots. All testing is currently taking place in Sierra Chart Sim mode. Slippage is not zero since some losses are wider than SL but for sure I estimate that live conditions will show poorer fills and more slippage. Contract size is 1, starting equity for each bot is $5000." },
              { type: 'paragraph', text: "Testing period results will inform future refinements and broader system modularization. Most importantly, deep dive analysis will also allow the training of a Machine Learning Model which will enable automated dynamic switching between signal detection and trailing stop configurations based on volatility and market regime. Eventually a controller study will allow intelligent profit/loss management per session and the option to rotate between MNQ/NQ or different order sizes to optimize reward vs. risk." },
              { type: 'paragraph', text: "I am currently developing an NQ swing bot and an SPX Put Spread bot, which I hope to test from Q3 2025....so stay tuned! And, yes, in case you are wondering, this dashboard updates live every 10 secs with new trades taken. As time goes on, I'll aim to improve the functionality and usefulness of this dashboard." },
              { type: 'paragraph', text: "Happy viewing/trading! And...if you have any questions or feedback, please reach out to @3_lines_smooth on twitter/x" }
            ]
          },
          {
            id: 'scalpBot',
            title: 'Scalp Bot',
            content: [
              { type: 'paragraph', text: "Content coming soon..." }
            ]
          },
          {
            id: 'swingBot',
            title: 'Swing Bot',
            content: [
              { type: 'paragraph', text: "Content coming soon..." }
            ]
          },
          {
            id: 'spxBot',
            title: 'SPX Bot',
            content: [
              { type: 'paragraph', text: "Content coming soon..." }
            ]
          },
          {
            id: 'techStack',
            title: 'Technology Stack',
            content: [
              { type: 'paragraph', text: "Content coming soon..." }
            ]
          }
        ];

        // Cache the content
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          sections,
          timestamp: Date.now()
        }));

        setState({ sections, isLoading: false });
      } catch (error) {
        console.error('Error loading information sections:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadContent();
  }, []);

  return state;
};

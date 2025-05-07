import { useEffect, useState } from 'react';
import Parser from 'rss-parser';

const parser = new Parser();

type FeedItem = {
    title: string;
    contentSnippet: string;
};

const getPronunciation = (content: string) => {
    return content?.split('\n')[ 0 ] || 'Pronunciation not available';
};

const getDefinition = (content: string): string => {
    return content?.split('\n').slice(1).join(' ') || 'Definition not available';
};

export default function WordOfTheDay() {
    const [ entries, setEntries ] = useState<FeedItem[]>([]);
    const [ currentIndex, setCurrentIndex ] = useState(0);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const feed = await parser.parseURL('http://www.merriam-webster.com/wotd/feed/rss2');
                setEntries(feed.items as FeedItem[]);
            } catch (error) {
                console.error('Error fetching RSS feed:', error);
            }
        };
        fetchFeed();
    }, []);

    if (entries.length === 0) {
        return <p className='text-center'>Word of the Day...</p>;
    }

    const currentEntry = entries[ currentIndex ];
    const word = currentEntry?.title || 'Word of the Day';
    const description = currentEntry?.contentSnippet || '';

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
            <div className="max-w-lg w-full shadow-xl rounded-2xl p-6 bg-white">
                <h1 className="text-3xl font-bold mb-2">{word}</h1>
                <p className='text-sm italic text-gray-500 mb-4'>
                    Pronunciation: {getPronunciation(description)}
                </p>
                <p className='mb-4'>
                    <strong>Definition:</strong> {getDefinition(description)}
                </p>
                <div className='flex justify-end mt-6'>
                    <button className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % entries.length)}
                    >
                        Next Word
                    </button>
                </div>
            </div>
        </main>
    );
}
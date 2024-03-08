import { useEffect } from "react";

const Suggestions = ({ suggestions, className, onSuggestionClick }) => {
    useEffect(() => {
        if (!suggestions || suggestions.length === 0) {
            console.log("No suggestions found");
        }
    }, [suggestions]);

    if (!suggestions || !Array.isArray(suggestions.movieData) || suggestions.movieData.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            {suggestions.movieData.map((suggestion, index) => (
                <div key={index} className="bg-white cursor-pointer text-black" onClick={() => onSuggestionClick(suggestion)}>
                    {suggestion}
                </div>
            ))}
        </div>
    );
}

export default Suggestions;
import filipinoBarwords from 'filipino-badwords-list';
import Filter from 'bad-words';
import { getUser } from './helpers';

export const filterText = (text) => {
    try {
        const filter = new Filter({ list: filipinoBarwords.array });
        if (typeof text === 'string' && getUser().role !== 'admin') {
            return replaceLinks(filter.clean(text));
        } else {
            return replaceLinks(text);
        }
    } catch (error) {
        console.error('Error filtering text:', error);
        return replaceLinks(text);
    }
}

function replaceLinks(text) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    console.log(text)
    // Replace URLs with anchor tags
    return text?.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}
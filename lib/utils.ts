import { MediaSource, Category } from './data';

// Filter media sources by category
export function filterMediaSources(sources: MediaSource[], category: Category): MediaSource[] {
  if (category === 'all') {
    return sources;
  }
  return sources.filter(source => source.category === category);
}

// Sort media sources by votes (descending)
export function sortMediaSourcesByVotes(sources: MediaSource[]): MediaSource[] {
  return [...sources].sort((a, b) => b.votes - a.votes);
}

// Handle voting
export function handleVote(
  sources: MediaSource[], 
  sourceId: string, 
  voteType: 'up' | 'down'
): MediaSource[] {
  return sources.map(source => {
    if (source.id === sourceId) {
      // If user already voted the same way, remove their vote
      if (source.userVote === voteType) {
        return {
          ...source,
          votes: voteType === 'up' ? source.votes - 1 : source.votes + 1,
          userVote: null
        };
      }
      
      // If user already voted the opposite way, change their vote
      if (source.userVote) {
        return {
          ...source,
          votes: voteType === 'up' ? source.votes + 2 : source.votes - 2,
          userVote: voteType
        };
      }
      
      // If user hasn't voted yet
      return {
        ...source,
        votes: voteType === 'up' ? source.votes + 1 : source.votes - 1,
        userVote: voteType
      };
    }
    return source;
  });
} 
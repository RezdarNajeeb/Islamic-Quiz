# Tournament System Documentation

## Overview

The Islamic Quiz Platform now includes a comprehensive tournament management system that allows administrators to create and manage knockout-style tournaments with multiple phases and games.

## Features

### 1. Tournament Structure
- **Tournaments**: Top-level containers for quiz competitions
- **Phases**: Organized stages within a tournament (e.g., Quarter-finals, Semi-finals, Finals)
- **Games**: Individual matches between two teams within a phase

### 2. Language Support
- **Central Kurdish (Sorani)**: Primary language (default)
- **Arabic**: Secondary language
- Full bilingual support for all tournament elements
- **Important**: Quran verses and Hadith are always displayed in Arabic regardless of UI language

### 3. Admin Features

#### Tournament Management
- Create tournaments with Kurdish and Arabic names/descriptions
- Track tournament status (pending, in_progress, completed)
- Delete tournaments

#### Phase Management
- Add phases to tournaments with custom order
- Configure number of games per phase
- Suggested structure:
  - Phase 1: 4 games (8 teams → 4 winners)
  - Phase 2: 2 games (4 teams → 2 winners)
  - Phase 3: 1 game (2 teams → 1 champion)

#### Game Management
- Assign questions to each game from the question bank
- Set placeholder names for teams (optional)
- Track game status and scores
- Multiple questions per game

### 4. Scoring System
- **Simplified Scoring**: Each correct answer = 1 point
- **No Difficulty Levels**: All questions weighted equally
- Points determine match winners
- Winner advances to next phase

## Technical Implementation

### Data Structure

```javascript
{
  tournaments: {
    [tournamentId]: {
      id: string,
      name: string,              // Arabic name
      nameCkb: string,           // Kurdish name
      description: string,       // Arabic description
      descriptionCkb: string,    // Kurdish description
      status: 'pending' | 'in_progress' | 'completed',
      phases: [
        {
          id: string,
          name: string,          // Arabic
          nameCkb: string,       // Kurdish
          order: number,
          gamesCount: number,
          games: [
            {
              id: string,
              groupAPlaceholder: string,
              groupBPlaceholder: string,
              groupAName: string,
              groupBName: string,
              groupAScore: number,
              groupBScore: number,
              questionIds: string[],
              status: 'pending' | 'in_progress' | 'completed',
              winner: string | null,
              createdAt: string
            }
          ],
          status: 'pending' | 'in_progress' | 'completed',
          createdAt: string
        }
      ],
      createdAt: string,
      updatedAt: string
    }
  }
}
```

### Storage
- All data persisted to browser's localStorage
- Automatic save on any tournament modification
- Data survives page refreshes

### Redux Actions

```javascript
// Tournament actions
CREATE_TOURNAMENT
UPDATE_TOURNAMENT
DELETE_TOURNAMENT
SET_TOURNAMENTS

// Phase actions
ADD_TOURNAMENT_PHASE
UPDATE_TOURNAMENT_PHASE

// Game actions
ADD_TOURNAMENT_GAME
UPDATE_TOURNAMENT_GAME

// Navigation actions
SET_CURRENT_TOURNAMENT
SET_CURRENT_TOURNAMENT_GAME
```

## Usage Guide

### For Administrators

#### Creating a Tournament

1. Navigate to Admin Panel → البطولات / پاڵەوێنەکان (Tournaments)
2. Click "دروستکردنی پاڵەوێنەی نوێ / Create New Tournament"
3. Fill in tournament details:
   - Arabic name (e.g., "مسابقة المعرفة الإسلامية 2024")
   - Kurdish name (e.g., "پاڵەوێنەی زانستی ئیسلامی ٢٠٢٤")
   - Descriptions in both languages
4. Click "Create"

#### Adding Phases

1. Click "قۆناغ / Phase" button on the tournament card
2. Enter phase details:
   - Arabic and Kurdish names
   - Order number (1, 2, 3)
   - Number of games
3. Click "Add"

#### Adding Games

1. Click "یاری / Game" button on a phase
2. (Optional) Enter team placeholder names
3. Select questions for this game by clicking on them
4. Click "Add"

#### Tracking Progress

- **Tournament Status Badge**: Shows if tournament is pending, in progress, or completed
- **Phase Details**: Shows number of games in each phase
- **Game Cards**: Display teams, questions count, and status for each game

### For Players/Operators

#### Starting a Tournament Game

1. From the home screen, select "Tournament Mode"
2. Choose the tournament and phase
3. Select the specific game to play
4. Enter the two team names when prompted
5. Play the game normally
6. Winner automatically advances to next phase

## Key Changes from Standard Mode

1. **No Category Selection**: Questions are pre-assigned by admin
2. **Fixed Question Pool**: Each game uses specific questions
3. **Automatic Progression**: Winners advance through phases
4. **Simplified Scoring**: 1 point per correct answer (no difficulty multipliers)
5. **Bilingual UI**: Full support for Central Kurdish and Arabic

## User Interface Elements Removed

As per requirements, the following have been removed:
- ❌ English language option (only Kurdish and Arabic)
- ❌ Sound effects
- ❌ Particle animations
- ❌ Celebration animations
- ❌ Difficulty levels

## CSS Fixes Applied

1. **Hover State Bug**: Selected answer boxes no longer turn white on hover
   - Correct answers stay green
   - Wrong answers stay red
   - Hover only applies to unselected options

## Testing Checklist

### Tournament Creation
- [ ] Create tournament with both language names
- [ ] Verify tournament appears in list
- [ ] Confirm tournament persists after page refresh

### Phase Management
- [ ] Add multiple phases with different orders
- [ ] Verify phases display in correct order
- [ ] Confirm phase deletion works

### Game Setup
- [ ] Add games to phases
- [ ] Assign questions to games
- [ ] Verify question selection works correctly
- [ ] Confirm no duplicate questions across games (if intended)

### Data Persistence
- [ ] Refresh page and verify all tournaments persist
- [ ] Make changes and confirm they save automatically
- [ ] Export data and verify tournaments included
- [ ] Import data and verify tournaments restored

### Language Switching
- [ ] Switch between Kurdish and Arabic in settings
- [ ] Verify all tournament elements update language
- [ ] Confirm Arabic text displays correctly (RTL)
- [ ] Verify Kurdish text displays correctly

### UI/UX
- [ ] Hover on unselected answers shows preview
- [ ] Hover on selected answers does NOT change color
- [ ] No sounds play during gameplay
- [ ] No animations/particles appear on correct answers
- [ ] Modals open and close correctly
- [ ] All buttons work as expected

## Technical Notes

### Browser Compatibility
- Requires modern browser with localStorage support
- Tested on Chrome, Firefox, Safari
- Mobile responsive design included

### Data Backup
**IMPORTANT**: Since data is stored in localStorage:
- Always export tournament data before clearing browser cache
- Use the "Export Data" feature in Settings tab regularly
- localStorage is per-browser and per-domain

### Performance
- No backend required - fully client-side
- Fast data access via localStorage
- Suitable for local/offline competitions
- Scales to hundreds of questions and multiple tournaments

## Future Enhancements (Not Yet Implemented)

The following features are planned but not yet implemented:
- [ ] Live tournament game play mode
- [ ] Real-time winner advancement during gameplay
- [ ] Tournament bracket visualization
- [ ] Final leaderboard screen
- [ ] Print-friendly tournament brackets
- [ ] Tournament statistics and analytics
- [ ] Team registration system
- [ ] Multi-device synchronization

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify localStorage is not disabled
3. Try exporting/importing data to reset state
4. Check that all required questions exist before assigning to games

## Version History

### Version 1.0.0 (Current)
- Initial tournament system implementation
- Kurdish language support added
- English language removed
- Simplified scoring system (1 point per question)
- Sound and animation effects removed
- CSS hover bug fixed
- Admin tournament management UI
- Data persistence to localStorage

---

**Note**: This is a client-side application. All data is stored locally in the browser. Make regular backups using the Export Data feature.

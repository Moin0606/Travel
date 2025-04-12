/**
 * Calculates the match score between a user and a travel post.
 * @param {Object} user - The user object containing preferences.
 * @param {Object} travelPost - The travel post object containing requirements.
 * @returns {Number} - The calculated match score.
 */
function calculateMatchScore(user, travelPost) {
    let score = 0;
  
    // Ensure both user and travelPost have valid data
    if (!user.travelPreferences || !travelPost.requirements) {
      return score; // Return 0 if data is incomplete
    }
  
    const { destinations, budgetRange } = user.travelPreferences;
    const { minAge, maxAge, genderPreference } = travelPost.requirements;
  
    // 1. Check if the user's preferred destinations include the post's destination
    if (
      Array.isArray(destinations) &&
      destinations.includes(travelPost.destination)
    ) {
      score += 30; // High weight for matching destination
    }
  
    // 2. Check if the user's budget range overlaps with the post's budget
    if (
      budgetRange &&
      budgetRange.min <= travelPost.budget &&
      budgetRange.max >= travelPost.budget
    ) {
      score += 30; // High weight for matching budget
    }
  
    // 3. Check if the user's age is within the post's required range
    if (user.age >= minAge && user.age <= maxAge) {
      score += 20; // Medium weight for age match
    }
  
    // 4. Check if the user's gender matches the post's gender preference
    if (genderPreference === "any" || genderPreference === user.gender) {
      score += 20; // Medium weight for gender match
    }
  
    return score;
  }
  
  module.exports = calculateMatchScore;
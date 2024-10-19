// utils/SkillMatchingAlgorithm.js
class SkillMatchingAlgorithm {
  constructor(users) {
    this.users = users;
  }

  _calculateCompatibilityScore(user1, user2, matchingSkills) {
    let score = matchingSkills.length * 10;

    if (user1.learningStyle === user2.learningStyle) score += 5;
    const availabilityMatch = user1.availability.filter((day) =>
      user2.availability.includes(day)
    ).length;
    score += availabilityMatch * 2;
    if (user1.goals === user2.goals) score += 5;
    const expDiff = Math.abs(user1.experienceLevel - user2.experienceLevel);
    if (expDiff > 0 && expDiff <= 2) score += 3;
    if (user1.preferredLanguage === user2.preferredLanguage) score += 5;

    return score;
  }

  findMatches(user) {
    const potentialMentors = [];
    const potentialMentees = [];

    for (const otherUser of this.users) {
      const mentorSkills = user.skillsToLearn.filter((skill) =>
        otherUser.skills.includes(skill)
      );
      if (mentorSkills.length > 0) {
        const score = this._calculateCompatibilityScore(
          user,
          otherUser,
          mentorSkills
        );
        potentialMentors.push({
          _id: otherUser._id,
          name: otherUser.name,
          matchingSkills: mentorSkills,
          score,
        });
      }

      const menteeSkills = otherUser.skillsToLearn.filter((skill) =>
        user.skills.includes(skill)
      );
      if (menteeSkills.length > 0) {
        const score = this._calculateCompatibilityScore(
          otherUser,
          user,
          menteeSkills
        );
        potentialMentees.push({
          _id: otherUser._id,
          name: otherUser.name,
          matchingSkills: menteeSkills,
          score,
        });
      }
    }

    potentialMentors.sort((a, b) => b.score - a.score);
    potentialMentees.sort((a, b) => b.score - a.score);

    return {
      potentialMentors: potentialMentors.slice(0, 5),
      potentialMentees: potentialMentees.slice(0, 5),
    };
  }
}

module.exports = SkillMatchingAlgorithm;

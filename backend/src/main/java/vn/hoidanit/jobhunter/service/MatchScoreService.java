package vn.hoidanit.jobhunter.service;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import vn.hoidanit.jobhunter.domain.Job;
import vn.hoidanit.jobhunter.domain.Skill;
import vn.hoidanit.jobhunter.domain.User;
import vn.hoidanit.jobhunter.domain.Subscriber;

@Service
public class MatchScoreService {

    private final SubscriberService subscriberService;

    // A simulated "Skill AI Model" mapping skill names to their relative importance weights
    private static final Map<String, Double> SKILL_WEIGHTS = Map.of(
        "java", 1.5, 
        "spring boot", 2.0, 
        "react", 1.8, 
        "sql", 1.2, 
        "docker", 1.5,
        "typescript", 1.7,
        "javascript", 1.5
    );

    public MatchScoreService(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    /**
     * Calculates an AI-driven weighted match score between a user and a job.
     */
    public Map<String, Object> calculateMatchScore(User user, Job job) {
        Subscriber subscriber = user.getEmail() != null ? subscriberService.findByEmail(user.getEmail()) : null;
        List<String> userSkills = (subscriber != null && subscriber.getSkills() != null) 
            ? subscriber.getSkills().stream().map(s -> s.getName().toLowerCase()).collect(Collectors.toList()) 
            : new ArrayList<>();

        double totalScore = 0.0;
        double maxPossibleScore = 0.0;
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        if (job.getSkills() != null) {
            for (Skill skill : job.getSkills()) {
                String skillName = skill.getName().toLowerCase();
                double weight = SKILL_WEIGHTS.getOrDefault(skillName, 1.0); // Default weight 1.0
                
                maxPossibleScore += weight;
                
                if (userSkills.contains(skillName)) {
                    totalScore += weight;
                    matchedSkills.add(skill.getName());
                } else {
                    missingSkills.add(skill.getName());
                }
            }
        }

        // Calculate score as a percentage of weighted skill match
        int finalScore = (maxPossibleScore == 0) ? 50 : (int) Math.round((totalScore / maxPossibleScore) * 100);

        // Heuristic adjustment for location relevance
        if (job.getLocation() != null && user.getAddress() != null && 
            job.getLocation().toLowerCase().contains(user.getAddress().toLowerCase())) {
            finalScore = Math.min(100, finalScore + 5);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("job", job);
        result.put("matchScore", finalScore);
        result.put("matchedSkills", matchedSkills);
        result.put("missingSkills", missingSkills);
        result.put("reasons", generateReason(finalScore));

        return result;
    }

    private String generateReason(int score) {
        if (score >= 80) return "Hồ sơ rất phù hợp với yêu cầu chuyên môn cao.";
        if (score >= 60) return "Hồ sơ khá phù hợp, có thể cần bổ sung một vài kỹ năng.";
        return "Cần bổ sung nhiều kỹ năng chuyên môn cho công việc này.";
    }
}

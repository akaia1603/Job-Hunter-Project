package vn.hoidanit.jobhunter.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.hoidanit.jobhunter.domain.SavedJob;
import vn.hoidanit.jobhunter.domain.User;
import vn.hoidanit.jobhunter.domain.Job;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);
    SavedJob findByUserAndJob(User user, Job job);
    boolean existsByUserAndJob(User user, Job job);
}

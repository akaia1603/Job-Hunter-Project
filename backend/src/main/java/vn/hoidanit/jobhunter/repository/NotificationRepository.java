package vn.hoidanit.jobhunter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.hoidanit.jobhunter.domain.Notification;
import vn.hoidanit.jobhunter.domain.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    java.util.List<Notification> findByUser(User user);
    long countByUserAndIsRead(User user, boolean isRead);
    java.util.List<Notification> findByUserAndIsRead(User user, boolean isRead);
}

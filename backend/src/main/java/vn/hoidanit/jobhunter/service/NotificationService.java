package vn.hoidanit.jobhunter.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.hoidanit.jobhunter.domain.Notification;
import vn.hoidanit.jobhunter.domain.User;
import vn.hoidanit.jobhunter.repository.NotificationRepository;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> fetchByUser(User user) {
        return this.notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long countUnread(User user) {
        return this.notificationRepository.countByUserAndIsReadFalse(user);
    }

    public void markAsRead(long id) {
        Notification nt = this.notificationRepository.findById(id).orElse(null);
        if (nt != null) {
            nt.setRead(true);
            this.notificationRepository.save(nt);
        }
    }

    public void markAllAsRead(User user) {
        List<Notification> list = this.notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification nt : list) {
            nt.setRead(true);
        }
        this.notificationRepository.saveAll(list);
    }

    // Helper to create new notification
    public Notification createNotification(User user, String title, String body, String type, String icon) {
        Notification nt = new Notification();
        nt.setUser(user);
        nt.setTitle(title);
        nt.setBody(body);
        nt.setType(type);
        nt.setIcon(icon);
        return this.notificationRepository.save(nt);
    }
}

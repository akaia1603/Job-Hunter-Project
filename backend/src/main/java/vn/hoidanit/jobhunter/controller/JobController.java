package vn.hoidanit.jobhunter.controller;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import vn.hoidanit.jobhunter.domain.Job;
import vn.hoidanit.jobhunter.domain.request.ReqCreateJobDTO;
import vn.hoidanit.jobhunter.domain.response.ResultPaginationDTO;
import vn.hoidanit.jobhunter.domain.response.job.ResCreateJobDTO;
import vn.hoidanit.jobhunter.domain.response.job.ResUpdateJobDTO;
import vn.hoidanit.jobhunter.service.JobService;
import vn.hoidanit.jobhunter.util.SecurityUtil;
import vn.hoidanit.jobhunter.util.annotation.ApiMessage;
import vn.hoidanit.jobhunter.util.error.IdInvalidException;
import vn.hoidanit.jobhunter.util.error.PermissionException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Job", description = "API Quản lý Tin tuyển dụng")
public class JobController {

    private final JobService jobService;
    private final vn.hoidanit.jobhunter.service.UserService userService;
    private final vn.hoidanit.jobhunter.service.MatchScoreService matchScoreService;
    private final vn.hoidanit.jobhunter.repository.SavedJobRepository savedJobRepository;

    public JobController(JobService jobService, 
            vn.hoidanit.jobhunter.service.UserService userService,
            vn.hoidanit.jobhunter.service.MatchScoreService matchScoreService,
            vn.hoidanit.jobhunter.repository.SavedJobRepository savedJobRepository) {
        this.jobService = jobService;
        this.userService = userService;
        this.matchScoreService = matchScoreService;
        this.savedJobRepository = savedJobRepository;
    }

    @PostMapping("/jobs")
    @ApiMessage("Create a job")
    @Operation(summary = "Tạo mới tin tuyển dụng", description = "HR tạo một công việc mới cho công ty mình")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<ResCreateJobDTO> create(@Valid @RequestBody ReqCreateJobDTO req) throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.jobService.create(req, email));
    }

    @PutMapping("/jobs")
    @ApiMessage("Update a job")
    @Operation(summary = "Cập nhật tin tuyển dụng", description = "Cập nhật thông tin chi tiết của một tin tuyển dụng hiện có")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<ResUpdateJobDTO> update(@Valid @RequestBody Job job) throws IdInvalidException, PermissionException {
        Optional<Job> currentJob = this.jobService.fetchJobById(job.getId());
        if (currentJob.isEmpty()) {
            throw new IdInvalidException("Job not found");
        }

        return ResponseEntity.ok()
                .body(this.jobService.update(job, currentJob.get()));
    }

    @DeleteMapping("/jobs/{id}")
    @ApiMessage("Delete a job by id")
    @Operation(summary = "Xóa tin tuyển dụng", description = "Xóa bản ghi tuyển dụng dựa trên ID")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        Optional<Job> currentJob = this.jobService.fetchJobById(id);
        if (currentJob.isEmpty()) {
            throw new IdInvalidException("Job not found");
        }

        this.jobService.delete(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/jobs/{id}")
    @ApiMessage("Get a job by id")
    @Operation(summary = "Lấy chi tiết tin tuyển dụng", description = "Lấy toàn bộ thông tin của một công việc thông qua ID")
    public ResponseEntity<java.util.Map<String, Object>> getJob(@PathVariable("id") long id) throws IdInvalidException {
        Optional<Job> currentJob = this.jobService.fetchJobById(id);
        if (currentJob.isEmpty()) {
            throw new IdInvalidException("Job not found");
        }

        Job job = currentJob.get();
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("job", job);

        // Check if current user is premium candidate
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        vn.hoidanit.jobhunter.domain.User currentUser = this.userService.handleGetUserByUsername(email);
        
        if (currentUser != null && Boolean.TRUE.equals(currentUser.getIsPremiumCandidate()) 
            && currentUser.getPremiumCandidateExpiryDate() != null 
            && currentUser.getPremiumCandidateExpiryDate().isAfter(java.time.Instant.now())) {
            
            // Return applicant count for premium candidates
            long applicantCount = job.getResumes() != null ? job.getResumes().size() : 0;
            response.put("applicantCount", applicantCount);
        }

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/jobs")
    @ApiMessage("Get job with pagination")
    @Operation(summary = "Lấy danh sách tin tuyển dụng", description = "Lấy danh sách công việc có hỗ trợ phân trang và lọc")
    public ResponseEntity<ResultPaginationDTO> getAllJob(
            @Filter Specification<Job> spec,
            Pageable pageable) {

        return ResponseEntity.ok().body(this.jobService.fetchAll(spec, pageable));
    }

    @GetMapping("/jobs/recommend")
    @ApiMessage("Get AI recommended jobs for current user")
    @Operation(summary = "Gợi ý việc làm AI", description = "Sử dụng AI để gợi ý các công việc phù hợp với kỹ năng của người dùng")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getRecommendedJobs() {
        String email = vn.hoidanit.jobhunter.util.SecurityUtil.getCurrentUserLogin().orElse("");
        vn.hoidanit.jobhunter.domain.User currentUser = this.userService.handleGetUserByUsername(email);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ResultPaginationDTO allJobsDTO = this.jobService.fetchAll(null, Pageable.unpaged());
        @SuppressWarnings("unchecked")
        java.util.List<Job> allJobs = (java.util.List<Job>) allJobsDTO.getResult();

        java.util.List<java.util.Map<String, Object>> recommendations = new java.util.ArrayList<>();
        if (allJobs != null) {
            for (Job job : allJobs) {
                if (job.isActive()) {
                    java.util.Map<String, Object> matchResult = this.matchScoreService.calculateMatchScore(currentUser, job);
                    int score = (int) matchResult.get("matchScore");
                    if (score > 30) {
                        recommendations.add(matchResult);
                    }
                }
            }
        }
        
        recommendations.sort((m1, m2) -> Integer.compare((int)m2.get("matchScore"), (int)m1.get("matchScore")));

        return ResponseEntity.ok().body(recommendations);
    }

    @PostMapping("/jobs/{id}/save")
    @ApiMessage("Toggle save job for current user")
    @Operation(summary = "Lưu/Hủy lưu việc làm", description = "Lưu hoặc hủy lưu một công việc vào danh sách yêu thích")
    public ResponseEntity<String> toggleSaveJob(@PathVariable("id") long id) throws IdInvalidException {
        String email = vn.hoidanit.jobhunter.util.SecurityUtil.getCurrentUserLogin().orElse("");
        vn.hoidanit.jobhunter.domain.User currentUser = this.userService.handleGetUserByUsername(email);

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Job> currentJob = this.jobService.fetchJobById(id);
        if (currentJob.isEmpty()) {
            throw new IdInvalidException("Job not found");
        }

        Job job = currentJob.get();
        boolean exists = this.savedJobRepository.existsByUserAndJob(currentUser, job);

        if (exists) {
            vn.hoidanit.jobhunter.domain.SavedJob savedJob = this.savedJobRepository.findByUserAndJob(currentUser, job);
            if (savedJob != null) {
                this.savedJobRepository.delete(savedJob);
            }
            return ResponseEntity.ok().body("Job unsaved successfully");
        } else {
            vn.hoidanit.jobhunter.domain.SavedJob savedJob = new vn.hoidanit.jobhunter.domain.SavedJob();
            savedJob.setUser(currentUser);
            savedJob.setJob(job);
            this.savedJobRepository.save(savedJob);
            return ResponseEntity.ok().body("Job saved successfully");
        }
    }
}

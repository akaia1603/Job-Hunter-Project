package vn.hoidanit.jobhunter.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.turkraft.springfilter.boot.Filter;
import com.turkraft.springfilter.builder.FilterBuilder;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import vn.hoidanit.jobhunter.domain.Company;
import vn.hoidanit.jobhunter.domain.Job;
import vn.hoidanit.jobhunter.domain.Resume;
import vn.hoidanit.jobhunter.domain.Role;
import vn.hoidanit.jobhunter.domain.User;
import vn.hoidanit.jobhunter.domain.response.ResultPaginationDTO;
import vn.hoidanit.jobhunter.domain.response.resume.ResCreateResumeDTO;
import vn.hoidanit.jobhunter.domain.response.resume.ResFetchResumeDTO;
import vn.hoidanit.jobhunter.domain.response.resume.ResUpdateResumeDTO;
import vn.hoidanit.jobhunter.service.ResumeService;
import vn.hoidanit.jobhunter.service.UserService;
import vn.hoidanit.jobhunter.util.SecurityUtil;
import vn.hoidanit.jobhunter.util.annotation.ApiMessage;
import vn.hoidanit.jobhunter.util.error.IdInvalidException;
import vn.hoidanit.jobhunter.util.error.PermissionException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Resume", description = "API Quản lý Hồ sơ ứng tuyển (CV)")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserService userService;

    private final FilterBuilder filterBuilder;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public ResumeController(
            ResumeService resumeService,
            UserService userService,
            FilterBuilder filterBuilder,
            FilterSpecificationConverter filterSpecificationConverter) {
        this.resumeService = resumeService;
        this.userService = userService;
        this.filterBuilder = filterBuilder;
        this.filterSpecificationConverter = filterSpecificationConverter;
    }

    @PostMapping("/resumes")
    @ApiMessage("Create a resume")
    @Operation(summary = "Nộp CV", description = "Người dùng nộp CV vào một công việc cụ thể")
    public ResponseEntity<ResCreateResumeDTO> create(@Valid @RequestBody Resume resume) throws IdInvalidException {
        boolean isIdExist = this.resumeService.checkResumeExistByUserAndJob(resume);
        if (!isIdExist) {
            throw new IdInvalidException("User id/Job id không tồn tại");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.resumeService.create(resume));
    }

    @PutMapping("/resumes")
    @ApiMessage("Update a resume")
    @Operation(summary = "Phê duyệt/Cập nhật CV", description = "HR cập nhật trạng thái CV (PENDING, REVIEWING, APPROVED, REJECTED)")
    @PreAuthorize("hasAnyAuthority('ROLE_HR')")
    public ResponseEntity<ResUpdateResumeDTO> update(@RequestBody Resume resume) throws IdInvalidException, PermissionException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchById(resume.getId());
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id = " + resume.getId() + " không tồn tại");
        }

        Resume reqResume = reqResumeOptional.get();

        // Check ownership: HR can only update resumes of their company's jobs
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        User currentUser = this.userService.handleGetUserByUsername(email);
        
        if (currentUser.getCompany() == null || reqResume.getJob().getCompany() == null || 
            currentUser.getCompany().getId() != reqResume.getJob().getCompany().getId()) {
            throw new PermissionException("Bạn không có quyền cập nhật resume này.");
        }

        reqResume.setStatus(resume.getStatus());
        return ResponseEntity.ok().body(this.resumeService.update(reqResume));
    }

    @DeleteMapping("/resumes/{id}")
    @ApiMessage("Delete a resume by id")
    @Operation(summary = "Xóa CV", description = "Xóa bản ghi nộp CV dựa trên ID")
    public ResponseEntity<Void> delete(@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchById(id);
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id = " + id + " không tồn tại");
        }

        Resume reqResume = reqResumeOptional.get();
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        if (!reqResume.getUser().getEmail().equals(email)) {
            throw new PermissionException("Bạn không có quyền xóa resume của người khác.");
        }

        this.resumeService.delete(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/resumes/{id}")
    @ApiMessage("Fetch a resume by id")
    @Operation(summary = "Xem chi tiết CV", description = "Lấy thông tin chi tiết một bản ghi nộp CV")
    public ResponseEntity<ResFetchResumeDTO> fetchById(@PathVariable("id") long id) throws IdInvalidException, PermissionException {
        Optional<Resume> reqResumeOptional = this.resumeService.fetchById(id);
        if (reqResumeOptional.isEmpty()) {
            throw new IdInvalidException("Resume với id = " + id + " không tồn tại");
        }

        Resume reqResume = reqResumeOptional.get();
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        User currentUser = this.userService.handleGetUserByUsername(email);

        boolean isAllowed = false;
        if (currentUser != null) {
            Role role = currentUser.getRole();
            if (role != null && role.getName().equals("SUPER_ADMIN")) {
                isAllowed = true;
            } else if (reqResume.getUser().getEmail().equals(email)) {
                isAllowed = true;
            } else if (currentUser.getCompany() != null && reqResume.getJob().getCompany() != null &&
                       currentUser.getCompany().getId() == reqResume.getJob().getCompany().getId()) {
                isAllowed = true;
            }
        }

        if (!isAllowed) {
            throw new PermissionException("Bạn không có quyền xem resume này.");
        }

        return ResponseEntity.ok().body(this.resumeService.getResume(reqResume));
    }

    @GetMapping("/resumes")
    @ApiMessage("Fetch all resume with paginate")
    @Operation(summary = "Lấy danh sách CV", description = "Lấy danh sách CV (Admin xem hết, HR xem của công ty mình)")
    public ResponseEntity<ResultPaginationDTO> fetchAll(
            @Filter Specification<Resume> spec,
            Pageable pageable) {

        List<Long> arrJobIds = null;
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        User currentUser = this.userService.handleGetUserByUsername(email);
        if (currentUser != null) {
            Role role = currentUser.getRole();
            if (role != null && !role.getName().equals("SUPER_ADMIN")) {
                Company userCompany = currentUser.getCompany();
                if (userCompany != null) {
                    List<Job> companyJobs = userCompany.getJobs();
                    if (companyJobs != null && !companyJobs.isEmpty()) {
                        arrJobIds = companyJobs.stream().map(Job::getId)
                                .collect(Collectors.toList());
                    }
                }
            }
        }

        if (arrJobIds != null && !arrJobIds.isEmpty()) {
            Specification<Resume> jobInSpec = filterSpecificationConverter.convert(filterBuilder.field("job")
                    .in(filterBuilder.input(arrJobIds)).get());
            spec = jobInSpec.and(spec);
        }

        return ResponseEntity.ok().body(this.resumeService.fetchAllResume(spec, pageable));
    }

    @PostMapping("/resumes/by-user")
    @ApiMessage("Get list resumes by user")
    @Operation(summary = "Lấy CV theo người dùng", description = "Lấy danh sách các công việc mà người dùng hiện tại đã nộp CV")
    public ResponseEntity<ResultPaginationDTO> fetchResumeByUser(Pageable pageable) {
        return ResponseEntity.ok().body(this.resumeService.fetchResumeByUser(pageable));
    }
}

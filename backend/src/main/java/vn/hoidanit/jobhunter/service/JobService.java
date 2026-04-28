package vn.hoidanit.jobhunter.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.hoidanit.jobhunter.domain.Company;
import vn.hoidanit.jobhunter.domain.Job;
import vn.hoidanit.jobhunter.domain.Skill;
import vn.hoidanit.jobhunter.domain.User;
import vn.hoidanit.jobhunter.domain.request.ReqCreateJobDTO;
import vn.hoidanit.jobhunter.domain.response.ResultPaginationDTO;
import vn.hoidanit.jobhunter.domain.response.job.ResCreateJobDTO;
import vn.hoidanit.jobhunter.domain.response.job.ResUpdateJobDTO;
import vn.hoidanit.jobhunter.repository.CompanyRepository;
import vn.hoidanit.jobhunter.repository.JobRepository;
import vn.hoidanit.jobhunter.repository.SkillRepository;
import vn.hoidanit.jobhunter.repository.UserRepository;
import vn.hoidanit.jobhunter.util.SecurityUtil;
import vn.hoidanit.jobhunter.util.error.PermissionException;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository,
            SkillRepository skillRepository,
            CompanyRepository companyRepository,
            UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.skillRepository = skillRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    public Optional<Job> fetchJobById(long id) {
        return this.jobRepository.findById(id);
    }

    public ResCreateJobDTO create(ReqCreateJobDTO req, String email) throws PermissionException {
        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser == null) throw new PermissionException("User không tồn tại");

        Job j = new Job();
        j.setName(req.getName());
        j.setLocation(req.getLocation());
        j.setSalary(req.getSalary());
        j.setQuantity(req.getQuantity());
        j.setLevel(req.getLevel());
        j.setDescription(req.getDescription());
        j.setStartDate(req.getStartDate());
        j.setEndDate(req.getEndDate());
        j.setActive(true);

        if (currentUser.getRole() != null && !currentUser.getRole().getName().equals("SUPER_ADMIN")) {
            if (currentUser.getCompany() == null) {
                throw new PermissionException("Bạn phải thuộc về một công ty để tạo việc làm.");
            }
            j.setCompany(currentUser.getCompany());
        } else if (req.getCompany() != null && req.getCompany().getId() > 0) {
            Optional<Company> c = this.companyRepository.findById(req.getCompany().getId());
            c.ifPresent(j::setCompany);
        }

        if (req.getSkills() != null) {
            List<Skill> dbSkills = this.skillRepository.findByIdIn(req.getSkills());
            j.setSkills(dbSkills);
        }

        Job currentJob = this.jobRepository.save(j);
        return mapToResCreateJobDTO(currentJob);
    }

    public ResUpdateJobDTO update(Job j, Job jobInDB) throws PermissionException {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email);

        if (currentUser != null && currentUser.getRole() != null) {
            String roleName = currentUser.getRole().getName();
            
            if (roleName.equals("SUPER_ADMIN")) {
                // Admin can only moderate: enable/disable (e.g., if content violates policy)
                jobInDB.setActive(j.isActive());
                // Admin does NOT change name, salary, etc.
            } else {
                // HR: Can edit content but only of their company
                if (currentUser.getCompany() == null || jobInDB.getCompany() == null || 
                    currentUser.getCompany().getId() != jobInDB.getCompany().getId()) {
                    throw new PermissionException("Bạn không có quyền chỉnh sửa việc làm của công ty khác.");
                }

                if (j.getSkills() != null) {
                    List<Long> reqSkills = j.getSkills().stream().map(x -> x.getId()).collect(Collectors.toList());
                    List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
                    jobInDB.setSkills(dbSkills);
                }

                jobInDB.setName(j.getName());
                jobInDB.setSalary(j.getSalary());
                jobInDB.setQuantity(j.getQuantity());
                jobInDB.setLocation(j.getLocation());
                jobInDB.setLevel(j.getLevel());
                jobInDB.setStartDate(j.getStartDate());
                jobInDB.setEndDate(j.getEndDate());
                jobInDB.setActive(j.isActive()); 
            }
        }

        Job currentJob = this.jobRepository.save(jobInDB);
        return mapToResUpdateJobDTO(currentJob);
    }

    public void delete(long id) throws PermissionException {
        Optional<Job> jobOptional = this.jobRepository.findById(id);
        if (jobOptional.isPresent()) {
            Job jobInDB = jobOptional.get();
            String email = SecurityUtil.getCurrentUserLogin().orElse("");
            User currentUser = this.userRepository.findByEmail(email);

            if (currentUser != null && currentUser.getRole() != null && !currentUser.getRole().getName().equals("SUPER_ADMIN")) {
                if (currentUser.getCompany() == null || jobInDB.getCompany() == null || 
                    currentUser.getCompany().getId() != jobInDB.getCompany().getId()) {
                    throw new PermissionException("Bạn không có quyền xóa việc làm của công ty khác.");
                }
            }
            this.jobRepository.deleteById(id);
        }
    }

    public ResultPaginationDTO fetchAll(Specification<Job> spec, Pageable pageable) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email);

        if (currentUser == null || currentUser.getRole() == null || !currentUser.getRole().getName().equals("SUPER_ADMIN")) {
            Specification<Job> activeCompanySpec = (root, query, criteriaBuilder) -> 
                criteriaBuilder.equal(root.get("company").get("active"), true);
            spec = spec == null ? activeCompanySpec : spec.and(activeCompanySpec);
        }

        Page<Job> pageUser = this.jobRepository.findAll(spec, pageable);
        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();
        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());
        rs.setMeta(mt);

        List<Job> jobs = pageUser.getContent().stream().map(job -> {
            if (job.getCompany() != null) {
                boolean isPremium = Boolean.TRUE.equals(job.getCompany().getIsPremium()) 
                    && job.getCompany().getPremiumExpiryDate() != null 
                    && job.getCompany().getPremiumExpiryDate().isAfter(java.time.Instant.now());
                job.setIsPremium(isPremium);
            }
            return job;
        }).collect(Collectors.toList());

        rs.setResult(jobs);
        return rs;
    }

    private ResCreateJobDTO mapToResCreateJobDTO(Job currentJob) {
        ResCreateJobDTO dto = new ResCreateJobDTO();
        dto.setId(currentJob.getId());
        dto.setName(currentJob.getName());
        dto.setSalary(currentJob.getSalary());
        dto.setQuantity(currentJob.getQuantity());
        dto.setLocation(currentJob.getLocation());
        dto.setLevel(currentJob.getLevel());
        dto.setStartDate(currentJob.getStartDate());
        dto.setEndDate(currentJob.getEndDate());
        dto.setActive(currentJob.isActive());
        dto.setCreatedAt(currentJob.getCreatedAt());
        dto.setCreatedBy(currentJob.getCreatedBy());
        if (currentJob.getSkills() != null) {
            dto.setSkills(currentJob.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        }
        return dto;
    }

    private ResUpdateJobDTO mapToResUpdateJobDTO(Job currentJob) {
        ResUpdateJobDTO dto = new ResUpdateJobDTO();
        dto.setId(currentJob.getId());
        dto.setName(currentJob.getName());
        dto.setSalary(currentJob.getSalary());
        dto.setQuantity(currentJob.getQuantity());
        dto.setLocation(currentJob.getLocation());
        dto.setLevel(currentJob.getLevel());
        dto.setStartDate(currentJob.getStartDate());
        dto.setEndDate(currentJob.getEndDate());
        dto.setActive(currentJob.isActive());
        dto.setUpdatedAt(currentJob.getUpdatedAt());
        dto.setUpdatedBy(currentJob.getUpdatedBy());
        if (currentJob.getSkills() != null) {
            dto.setSkills(currentJob.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        }
        return dto;
    }
}

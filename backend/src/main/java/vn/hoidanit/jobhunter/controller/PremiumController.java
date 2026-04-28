package vn.hoidanit.jobhunter.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.hoidanit.jobhunter.domain.Company;
import vn.hoidanit.jobhunter.domain.User;
import vn.hoidanit.jobhunter.service.PremiumService;
import vn.hoidanit.jobhunter.service.UserService;
import vn.hoidanit.jobhunter.util.SecurityUtil;
import vn.hoidanit.jobhunter.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1/premium")
public class PremiumController {
    
    private final UserService userService;
    private final PremiumService premiumService;

    public PremiumController(UserService userService, PremiumService premiumService) {
        this.userService = userService;
        this.premiumService = premiumService;
    }

    @GetMapping("/packages")
    @ApiMessage("Get premium packages")
    public ResponseEntity<List<Map<String, Object>>> getPackages() {
        List<Map<String, Object>> packages = new ArrayList<>();
        
        Map<String, Object> basic = new HashMap<>();
        basic.put("id", 1);
        basic.put("name", "Nổi bật");
        basic.put("price", 1000000);
        
        Map<String, Object> pro = new HashMap<>();
        pro.put("id", 2);
        pro.put("name", "Pro");
        pro.put("price", 3000000);
        pro.put("isPopular", true);
        
        packages.add(basic);
        packages.add(pro);
        
        return ResponseEntity.ok(packages);
    }

    @PostMapping("/checkout/{tier}")
    @ApiMessage("Simulate premium checkout")
    public ResponseEntity<String> checkout(@PathVariable("tier") String tier) {
        String email = SecurityUtil.getCurrentUserLogin().orElse("");
        User currentUser = this.userService.handleGetUserByUsername(email);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not found.");
        }

        // Tạm thời giả lập thanh toán thành công
        this.premiumService.subscribePremium(currentUser.getCompany(), tier);
        
        return ResponseEntity.ok("Thanh toán thành công gói " + tier);
    }
}

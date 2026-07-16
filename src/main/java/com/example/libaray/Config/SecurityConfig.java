package com.example.libaray.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.libaray.Security.JwtFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                    // .requestMatchers("/auth/**").permitAll()

                    // .requestMatchers(HttpMethod.GET, "/books/**")
                    // .hasAnyRole("USER", "ADMIN")

                    // .requestMatchers(HttpMethod.POST, "/books/**")
                    // .hasRole("ADMIN")

                    // .requestMatchers(HttpMethod.PUT, "/books/**")
                    // .hasRole("ADMIN")

                    // .requestMatchers(HttpMethod.DELETE, "/books/**")
                    // .hasRole("ADMIN")

                    // .anyRequest().authenticated()
                    .anyRequest().permitAll()

            
            );

            // .addFilterBefore(jwtFilter,
            //         UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
package rocks.zipcode.blogblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rocks.zipcode.blogblog.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}

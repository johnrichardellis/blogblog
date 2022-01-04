package rocks.zipcode.blogblog.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import rocks.zipcode.blogblog.domain.BlogTag;

/**
 * Spring Data SQL repository for the BlogTag entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlogTagRepository extends JpaRepository<BlogTag, Long> {}

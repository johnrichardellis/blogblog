package rocks.zipcode.blogblog.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rocks.zipcode.blogblog.domain.BlogEntry;

/**
 * Spring Data SQL repository for the BlogEntry entity.
 */
@Repository
public interface BlogEntryRepository extends JpaRepository<BlogEntry, Long> {
    @Query(
        value = "select distinct blogEntry from BlogEntry blogEntry left join fetch blogEntry.tags",
        countQuery = "select count(distinct blogEntry) from BlogEntry blogEntry"
    )
    Page<BlogEntry> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct blogEntry from BlogEntry blogEntry left join fetch blogEntry.tags")
    List<BlogEntry> findAllWithEagerRelationships();

    @Query("select blogEntry from BlogEntry blogEntry left join fetch blogEntry.tags where blogEntry.id =:id")
    Optional<BlogEntry> findOneWithEagerRelationships(@Param("id") Long id);
}

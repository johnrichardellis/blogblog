package rocks.zipcode.blogblog.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import rocks.zipcode.blogblog.domain.BlogTag;
import rocks.zipcode.blogblog.repository.BlogTagRepository;
import rocks.zipcode.blogblog.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.blogblog.domain.BlogTag}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BlogTagResource {

    private final Logger log = LoggerFactory.getLogger(BlogTagResource.class);

    private static final String ENTITY_NAME = "blogTag";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BlogTagRepository blogTagRepository;

    public BlogTagResource(BlogTagRepository blogTagRepository) {
        this.blogTagRepository = blogTagRepository;
    }

    /**
     * {@code POST  /blog-tags} : Create a new blogTag.
     *
     * @param blogTag the blogTag to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new blogTag, or with status {@code 400 (Bad Request)} if the blogTag has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/blog-tags")
    public ResponseEntity<BlogTag> createBlogTag(@Valid @RequestBody BlogTag blogTag) throws URISyntaxException {
        log.debug("REST request to save BlogTag : {}", blogTag);
        if (blogTag.getId() != null) {
            throw new BadRequestAlertException("A new blogTag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BlogTag result = blogTagRepository.save(blogTag);
        return ResponseEntity
            .created(new URI("/api/blog-tags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /blog-tags/:id} : Updates an existing blogTag.
     *
     * @param id the id of the blogTag to save.
     * @param blogTag the blogTag to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blogTag,
     * or with status {@code 400 (Bad Request)} if the blogTag is not valid,
     * or with status {@code 500 (Internal Server Error)} if the blogTag couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/blog-tags/{id}")
    public ResponseEntity<BlogTag> updateBlogTag(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BlogTag blogTag
    ) throws URISyntaxException {
        log.debug("REST request to update BlogTag : {}, {}", id, blogTag);
        if (blogTag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blogTag.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blogTagRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BlogTag result = blogTagRepository.save(blogTag);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, blogTag.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /blog-tags/:id} : Partial updates given fields of an existing blogTag, field will ignore if it is null
     *
     * @param id the id of the blogTag to save.
     * @param blogTag the blogTag to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated blogTag,
     * or with status {@code 400 (Bad Request)} if the blogTag is not valid,
     * or with status {@code 404 (Not Found)} if the blogTag is not found,
     * or with status {@code 500 (Internal Server Error)} if the blogTag couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/blog-tags/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BlogTag> partialUpdateBlogTag(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BlogTag blogTag
    ) throws URISyntaxException {
        log.debug("REST request to partial update BlogTag partially : {}, {}", id, blogTag);
        if (blogTag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, blogTag.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!blogTagRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BlogTag> result = blogTagRepository
            .findById(blogTag.getId())
            .map(existingBlogTag -> {
                if (blogTag.getName() != null) {
                    existingBlogTag.setName(blogTag.getName());
                }

                return existingBlogTag;
            })
            .map(blogTagRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, blogTag.getId().toString())
        );
    }

    /**
     * {@code GET  /blog-tags} : get all the blogTags.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of blogTags in body.
     */
    @GetMapping("/blog-tags")
    public List<BlogTag> getAllBlogTags() {
        log.debug("REST request to get all BlogTags");
        return blogTagRepository.findAll();
    }

    /**
     * {@code GET  /blog-tags/:id} : get the "id" blogTag.
     *
     * @param id the id of the blogTag to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the blogTag, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/blog-tags/{id}")
    public ResponseEntity<BlogTag> getBlogTag(@PathVariable Long id) {
        log.debug("REST request to get BlogTag : {}", id);
        Optional<BlogTag> blogTag = blogTagRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(blogTag);
    }

    /**
     * {@code DELETE  /blog-tags/:id} : delete the "id" blogTag.
     *
     * @param id the id of the blogTag to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/blog-tags/{id}")
    public ResponseEntity<Void> deleteBlogTag(@PathVariable Long id) {
        log.debug("REST request to delete BlogTag : {}", id);
        blogTagRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}

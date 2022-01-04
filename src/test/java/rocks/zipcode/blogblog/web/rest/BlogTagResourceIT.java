package rocks.zipcode.blogblog.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.blogblog.IntegrationTest;
import rocks.zipcode.blogblog.domain.BlogTag;
import rocks.zipcode.blogblog.repository.BlogTagRepository;

/**
 * Integration tests for the {@link BlogTagResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BlogTagResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/blog-tags";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlogTagRepository blogTagRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlogTagMockMvc;

    private BlogTag blogTag;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlogTag createEntity(EntityManager em) {
        BlogTag blogTag = new BlogTag().name(DEFAULT_NAME);
        return blogTag;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlogTag createUpdatedEntity(EntityManager em) {
        BlogTag blogTag = new BlogTag().name(UPDATED_NAME);
        return blogTag;
    }

    @BeforeEach
    public void initTest() {
        blogTag = createEntity(em);
    }

    @Test
    @Transactional
    void createBlogTag() throws Exception {
        int databaseSizeBeforeCreate = blogTagRepository.findAll().size();
        // Create the BlogTag
        restBlogTagMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogTag)))
            .andExpect(status().isCreated());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeCreate + 1);
        BlogTag testBlogTag = blogTagList.get(blogTagList.size() - 1);
        assertThat(testBlogTag.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createBlogTagWithExistingId() throws Exception {
        // Create the BlogTag with an existing ID
        blogTag.setId(1L);

        int databaseSizeBeforeCreate = blogTagRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlogTagMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogTag)))
            .andExpect(status().isBadRequest());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = blogTagRepository.findAll().size();
        // set the field null
        blogTag.setName(null);

        // Create the BlogTag, which fails.

        restBlogTagMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogTag)))
            .andExpect(status().isBadRequest());

        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlogTags() throws Exception {
        // Initialize the database
        blogTagRepository.saveAndFlush(blogTag);

        // Get all the blogTagList
        restBlogTagMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blogTag.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getBlogTag() throws Exception {
        // Initialize the database
        blogTagRepository.saveAndFlush(blogTag);

        // Get the blogTag
        restBlogTagMockMvc
            .perform(get(ENTITY_API_URL_ID, blogTag.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blogTag.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBlogTag() throws Exception {
        // Get the blogTag
        restBlogTagMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlogTag() throws Exception {
        // Initialize the database
        blogTagRepository.saveAndFlush(blogTag);

        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();

        // Update the blogTag
        BlogTag updatedBlogTag = blogTagRepository.findById(blogTag.getId()).get();
        // Disconnect from session so that the updates on updatedBlogTag are not directly saved in db
        em.detach(updatedBlogTag);
        updatedBlogTag.name(UPDATED_NAME);

        restBlogTagMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlogTag.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlogTag))
            )
            .andExpect(status().isOk());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
        BlogTag testBlogTag = blogTagList.get(blogTagList.size() - 1);
        assertThat(testBlogTag.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBlogTag() throws Exception {
        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();
        blogTag.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlogTagMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blogTag.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blogTag))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlogTag() throws Exception {
        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();
        blogTag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogTagMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blogTag))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlogTag() throws Exception {
        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();
        blogTag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogTagMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogTag)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlogTagWithPatch() throws Exception {
        // Initialize the database
        blogTagRepository.saveAndFlush(blogTag);

        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();

        // Update the blogTag using partial update
        BlogTag partialUpdatedBlogTag = new BlogTag();
        partialUpdatedBlogTag.setId(blogTag.getId());

        restBlogTagMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlogTag.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlogTag))
            )
            .andExpect(status().isOk());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
        BlogTag testBlogTag = blogTagList.get(blogTagList.size() - 1);
        assertThat(testBlogTag.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBlogTagWithPatch() throws Exception {
        // Initialize the database
        blogTagRepository.saveAndFlush(blogTag);

        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();

        // Update the blogTag using partial update
        BlogTag partialUpdatedBlogTag = new BlogTag();
        partialUpdatedBlogTag.setId(blogTag.getId());

        partialUpdatedBlogTag.name(UPDATED_NAME);

        restBlogTagMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlogTag.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlogTag))
            )
            .andExpect(status().isOk());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
        BlogTag testBlogTag = blogTagList.get(blogTagList.size() - 1);
        assertThat(testBlogTag.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBlogTag() throws Exception {
        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();
        blogTag.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlogTagMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blogTag.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blogTag))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlogTag() throws Exception {
        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();
        blogTag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogTagMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blogTag))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlogTag() throws Exception {
        int databaseSizeBeforeUpdate = blogTagRepository.findAll().size();
        blogTag.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogTagMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(blogTag)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlogTag in the database
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlogTag() throws Exception {
        // Initialize the database
        blogTagRepository.saveAndFlush(blogTag);

        int databaseSizeBeforeDelete = blogTagRepository.findAll().size();

        // Delete the blogTag
        restBlogTagMockMvc
            .perform(delete(ENTITY_API_URL_ID, blogTag.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlogTag> blogTagList = blogTagRepository.findAll();
        assertThat(blogTagList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

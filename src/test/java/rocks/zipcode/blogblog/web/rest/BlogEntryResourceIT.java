package rocks.zipcode.blogblog.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import rocks.zipcode.blogblog.IntegrationTest;
import rocks.zipcode.blogblog.domain.BlogEntry;
import rocks.zipcode.blogblog.repository.BlogEntryRepository;

/**
 * Integration tests for the {@link BlogEntryResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BlogEntryResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/blog-entries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BlogEntryRepository blogEntryRepository;

    @Mock
    private BlogEntryRepository blogEntryRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBlogEntryMockMvc;

    private BlogEntry blogEntry;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlogEntry createEntity(EntityManager em) {
        BlogEntry blogEntry = new BlogEntry().title(DEFAULT_TITLE).content(DEFAULT_CONTENT).date(DEFAULT_DATE);
        return blogEntry;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BlogEntry createUpdatedEntity(EntityManager em) {
        BlogEntry blogEntry = new BlogEntry().title(UPDATED_TITLE).content(UPDATED_CONTENT).date(UPDATED_DATE);
        return blogEntry;
    }

    @BeforeEach
    public void initTest() {
        blogEntry = createEntity(em);
    }

    @Test
    @Transactional
    void createBlogEntry() throws Exception {
        int databaseSizeBeforeCreate = blogEntryRepository.findAll().size();
        // Create the BlogEntry
        restBlogEntryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isCreated());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeCreate + 1);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testBlogEntry.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testBlogEntry.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createBlogEntryWithExistingId() throws Exception {
        // Create the BlogEntry with an existing ID
        blogEntry.setId(1L);

        int databaseSizeBeforeCreate = blogEntryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBlogEntryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = blogEntryRepository.findAll().size();
        // set the field null
        blogEntry.setTitle(null);

        // Create the BlogEntry, which fails.

        restBlogEntryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = blogEntryRepository.findAll().size();
        // set the field null
        blogEntry.setDate(null);

        // Create the BlogEntry, which fails.

        restBlogEntryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isBadRequest());

        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBlogEntries() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        // Get all the blogEntryList
        restBlogEntryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(blogEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBlogEntriesWithEagerRelationshipsIsEnabled() throws Exception {
        when(blogEntryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBlogEntryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(blogEntryRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBlogEntriesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(blogEntryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBlogEntryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(blogEntryRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        // Get the blogEntry
        restBlogEntryMockMvc
            .perform(get(ENTITY_API_URL_ID, blogEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(blogEntry.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBlogEntry() throws Exception {
        // Get the blogEntry
        restBlogEntryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Update the blogEntry
        BlogEntry updatedBlogEntry = blogEntryRepository.findById(blogEntry.getId()).get();
        // Disconnect from session so that the updates on updatedBlogEntry are not directly saved in db
        em.detach(updatedBlogEntry);
        updatedBlogEntry.title(UPDATED_TITLE).content(UPDATED_CONTENT).date(UPDATED_DATE);

        restBlogEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBlogEntry.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBlogEntry))
            )
            .andExpect(status().isOk());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBlogEntry.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testBlogEntry.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();
        blogEntry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlogEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, blogEntry.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blogEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();
        blogEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogEntryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(blogEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();
        blogEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogEntryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(blogEntry)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBlogEntryWithPatch() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Update the blogEntry using partial update
        BlogEntry partialUpdatedBlogEntry = new BlogEntry();
        partialUpdatedBlogEntry.setId(blogEntry.getId());

        partialUpdatedBlogEntry.title(UPDATED_TITLE).content(UPDATED_CONTENT);

        restBlogEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlogEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlogEntry))
            )
            .andExpect(status().isOk());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBlogEntry.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testBlogEntry.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateBlogEntryWithPatch() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();

        // Update the blogEntry using partial update
        BlogEntry partialUpdatedBlogEntry = new BlogEntry();
        partialUpdatedBlogEntry.setId(blogEntry.getId());

        partialUpdatedBlogEntry.title(UPDATED_TITLE).content(UPDATED_CONTENT).date(UPDATED_DATE);

        restBlogEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBlogEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBlogEntry))
            )
            .andExpect(status().isOk());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
        BlogEntry testBlogEntry = blogEntryList.get(blogEntryList.size() - 1);
        assertThat(testBlogEntry.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testBlogEntry.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testBlogEntry.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();
        blogEntry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBlogEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, blogEntry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blogEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();
        blogEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogEntryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(blogEntry))
            )
            .andExpect(status().isBadRequest());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBlogEntry() throws Exception {
        int databaseSizeBeforeUpdate = blogEntryRepository.findAll().size();
        blogEntry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBlogEntryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(blogEntry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BlogEntry in the database
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBlogEntry() throws Exception {
        // Initialize the database
        blogEntryRepository.saveAndFlush(blogEntry);

        int databaseSizeBeforeDelete = blogEntryRepository.findAll().size();

        // Delete the blogEntry
        restBlogEntryMockMvc
            .perform(delete(ENTITY_API_URL_ID, blogEntry.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BlogEntry> blogEntryList = blogEntryRepository.findAll();
        assertThat(blogEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

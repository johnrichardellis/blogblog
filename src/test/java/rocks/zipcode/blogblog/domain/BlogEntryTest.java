package rocks.zipcode.blogblog.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.blogblog.web.rest.TestUtil;

class BlogEntryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlogEntry.class);
        BlogEntry blogEntry1 = new BlogEntry();
        blogEntry1.setId(1L);
        BlogEntry blogEntry2 = new BlogEntry();
        blogEntry2.setId(blogEntry1.getId());
        assertThat(blogEntry1).isEqualTo(blogEntry2);
        blogEntry2.setId(2L);
        assertThat(blogEntry1).isNotEqualTo(blogEntry2);
        blogEntry1.setId(null);
        assertThat(blogEntry1).isNotEqualTo(blogEntry2);
    }
}

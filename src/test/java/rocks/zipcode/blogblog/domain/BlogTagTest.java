package rocks.zipcode.blogblog.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.blogblog.web.rest.TestUtil;

class BlogTagTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BlogTag.class);
        BlogTag blogTag1 = new BlogTag();
        blogTag1.setId(1L);
        BlogTag blogTag2 = new BlogTag();
        blogTag2.setId(blogTag1.getId());
        assertThat(blogTag1).isEqualTo(blogTag2);
        blogTag2.setId(2L);
        assertThat(blogTag1).isNotEqualTo(blogTag2);
        blogTag1.setId(null);
        assertThat(blogTag1).isNotEqualTo(blogTag2);
    }
}

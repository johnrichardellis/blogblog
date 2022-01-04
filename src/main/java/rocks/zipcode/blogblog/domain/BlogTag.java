package rocks.zipcode.blogblog.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BlogTag.
 */
@Entity
@Table(name = "blog_tag")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BlogTag implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 2)
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "tags")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "blog", "tags" }, allowSetters = true)
    private Set<BlogEntry> entries = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public BlogTag id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BlogTag name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<BlogEntry> getEntries() {
        return this.entries;
    }

    public void setEntries(Set<BlogEntry> blogEntries) {
        if (this.entries != null) {
            this.entries.forEach(i -> i.removeTag(this));
        }
        if (blogEntries != null) {
            blogEntries.forEach(i -> i.addTag(this));
        }
        this.entries = blogEntries;
    }

    public BlogTag entries(Set<BlogEntry> blogEntries) {
        this.setEntries(blogEntries);
        return this;
    }

    public BlogTag addEntry(BlogEntry blogEntry) {
        this.entries.add(blogEntry);
        blogEntry.getTags().add(this);
        return this;
    }

    public BlogTag removeEntry(BlogEntry blogEntry) {
        this.entries.remove(blogEntry);
        blogEntry.getTags().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BlogTag)) {
            return false;
        }
        return id != null && id.equals(((BlogTag) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BlogTag{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
